import calcDiscount from './calcDiscount';
import { SCALING_FACTORS } from './constants';

const quantitative = require('../data/quantitative.json');

function _calc(infrastructure, travel, length, intersections, subtype, time_frame, selectedInfrastructure) {

  let benefits = {
    "bike": {
      "crashes": [],
      "crime": [],
      "deaths": [],
      "injuries": [],
      "speed": [],
      "yielding": [],
    },
    "pedestrian": {
      "crashes": [],
      "crime": [],
      "deaths": [],
      "injuries": [],
      "speed": [],
      "yielding": [],
    },
    "combined": {
      "crashes": [],
      "crime": [],
      "deaths": [],
      "injuries": [],
      "speed": [],
      "yielding": [],
    },
  };

  // Generate a list of benefits based
  // on which infrastructure elements are selected
  //
  // Element benefits can apply to different categories:
  // benefit applies to bike, adds to bike and combined categories
  // benefit applies to ped, adds to ped and combined categories
  // benefit applies to all, adds to combined category only
  //
  // Elements can have benefits for one/several parameters
  // e.g. crashes, crime, deaths, etc.
  //
  // For each selected element add a benefit for each type of
  // improvement (new/upgrade/retrofit) and scale the benefit accordingly
  // Also scale each benefit based on the element's share of the project

  // go through each category
  for(let category of infrastructure.categories) {

    // go through each item
    for(let item of category.items) {

      // if selected and has benefits
      if(item.shortname in selectedInfrastructure && item.shortname in quantitative) {

        for(let type in SCALING_FACTORS) {

          let value = selectedInfrastructure[item.shortname][type];

          if(value === 0) {
            continue;
          }

          let benefit = quantitative[item.shortname];
          let share = 0;

          // get share
          if(item.calc_units === 'length') {

            if(item.units === 'count') {
              // In this case we ask them for a count and
              // then apply a preset length per item
              // i.e. lights every 100 feet
              // and then apply that as a portion of the
              // total project length
              // all are assumed to be per 100 feet right now
              // this will probably change at some point.
              share = (value * 100) / length;
            }
            else if(item.units === 'length') {
              share = value / length;
            }
          }
          else if(item.calc_units === 'count') {
            share = value / intersections;
          }

          share *= SCALING_FACTORS[type];

          // for each effect
          // bike append to bike and combined percent + share
          // ped append to ped and combined percent + share
          // all append to combined percent + share
          for(let effect of benefit) {

            if(effect.mode === 'bike') {
              benefits.bike[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });

              benefits.combined[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });
            }
            else if(effect.mode === 'pedestrian') {
              benefits.pedestrian[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });

              benefits.combined[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });
            }
            else if(effect.mode === 'all') {
              benefits.combined[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });
            }
            else {
              console.log(`Unknown effect mode: ${effect.mode}!`);
            }
          }
        }
      }
    }
  }

  // console.log(benefits);

  let calculatedBenefits = {};

  // Combine lsit of benefits for all elements to a total
  // benefit for each category and parameter
  for(let category of ['bike', 'pedestrian', 'combined']) {

    calculatedBenefits[category] = {};

    for(let parameter in benefits[category]) {

      // if length
      if(benefits[category][parameter].length) {

        // console.log(`${category} ${parameter} has some!`);

        calculatedBenefits[category][parameter] = {
          'lower': 1,
          'mean': 1,
          'upper': 1,
        };

        // multiply all effects (percent * share) together for lower/mean/upper
        for(let benefit of benefits[category][parameter]) {

          // console.log(benefit);

          // calculatedBenefits[category]
          calculatedBenefits[category][parameter].lower *= 1 + ((benefit.lower / 100) * benefit.share);
          calculatedBenefits[category][parameter].mean *= 1 + ((benefit.mean / 100) * benefit.share);
          calculatedBenefits[category][parameter].upper *= 1 + ((benefit.upper / 100) * benefit.share);
        }

      }
      else {

        calculatedBenefits[category][parameter] = {};

        calculatedBenefits[category][parameter].lower = null;
        calculatedBenefits[category][parameter].mean = null;
        calculatedBenefits[category][parameter].upper = null;
      }
    }
  }

  // console.log('-------------------------------')
  // console.log(calculatedBenefits);

  // Calculate the yearly benefit by multiplying the appropriate daily demand
  // in miles by the benefit and then by 365
  for(let category of ['bike', 'pedestrian', 'combined']) {

    let modeProjectedTravel;

    // multiply by appropriate distance
    // bike: travel.bike.projected
    // ped: travel.pedestrian.projected
    // combined: travel.totalProjected
    if(category === 'bike') {
      modeProjectedTravel = travel.bike.projected;
    }
    else if(category === 'pedestrian') {
      modeProjectedTravel = travel.pedestrian.projected;
    }
    else if(category === 'combined') {
      modeProjectedTravel = travel.totalProjected;
    }

    for(let parameter in calculatedBenefits[category]) {

      for(let range of ['lower', 'mean', 'upper']) {

        // multiply by time frame (1yr -> 365 days, miles are per day)
        if(calculatedBenefits[category][parameter][range] !== null) {
          calculatedBenefits[category][parameter][range] *= modeProjectedTravel[range] * 365;
        }
      }
    }
  }

  // console.log('RESULT');
  // console.log(calculatedBenefits);

  // Calculate benefits over project time frame
  let adjustedBenefits = {};

  for(let category of ['bike', 'pedestrian', 'combined']) {

    adjustedBenefits[category] = {};

    for(let parameter in benefits[category]) {

      adjustedBenefits[category][parameter] = {};

      for(let range of ['lower', 'mean', 'upper']) {

        adjustedBenefits[category][parameter][range] = calculatedBenefits[category][parameter][range] !== null ?
          calcDiscount(calculatedBenefits[category][parameter][range], time_frame) : null;
      }
    }
  }

  return adjustedBenefits;
}

function calcSafetyQuantitative(infrastructure, travel, length, intersections, subtype, time_frame, selectedInfrastructure) {

  return {
    "miles": _calc(infrastructure, travel.miles, length, intersections, subtype, time_frame, selectedInfrastructure),
    "capita": _calc(infrastructure, travel.capita, length, intersections, subtype, time_frame, selectedInfrastructure),
    "jobs": _calc(infrastructure, travel.jobs, length, intersections, subtype, time_frame, selectedInfrastructure),
  }

}

export default calcSafetyQuantitative;

