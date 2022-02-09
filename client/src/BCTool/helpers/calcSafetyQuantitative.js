const quantitative = require('../data/quantitative.json');

function _calc(infrastructure, travel, length, intersections, subtype) {

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

  // go through each category
  for(let category of infrastructure.categories) {

    // go through each item
    for(let item of category.items) {

      // if selected and has benefits
      if(item.selected && item.shortname in quantitative) {

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
            share = (item.value * 100) / length;
          }
          else if(item.units === 'length') {
            share = item.value / length;
          }
        }
        else if(item.calc_units === 'count') {
          share = item.value / intersections;
        }

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

  // console.log(benefits);

  let calculatedBenefits = {};

  // go through benefits
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

  console.log('RESULT');
  console.log(calculatedBenefits);

  return calculatedBenefits;
}

function calcSafetyQuantitative(infrastructure, travel, length, intersections, subtype) {

  return {
    "miles": _calc(infrastructure, travel.miles, length, intersections, subtype),
    "capita": _calc(infrastructure, travel.capita, length, intersections, subtype),
    "jobs": _calc(infrastructure, travel.jobs, length, intersections, subtype),
  }

}

export default calcSafetyQuantitative;

