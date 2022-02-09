const quantitative = require('../data/quantitative.json');

function _calc(infrastructure, travel, length, intersections, subtype) {

  let miles = {};
  let percents = {};

  // for each category
  for(let category of infrastructure.categories) {

    // for each item
    for(let item of category.items) {

      // check if item has an entry in benefits
      if(item.shortname in quantitative) {

        // console.log(`Found quantitative safety benefits for ${item.label}`);

        // calc fraction of counts for this item compared to project counts
        let share = 0;

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

        let benefit = quantitative[item.shortname];

        for(let effect of benefit) {

          // console.log(`Calculating benefit for ${effect.mode} ${effect.parameter}`);

          let modeProjectedTravel;

          switch(effect.mode) {
            case 'bike':
              if(subtype !== 'pedestrian-only') {
                modeProjectedTravel = travel.bike.projected;
              }
            break;
            case 'pedestrian':
              if(subtype !== 'bike-only') {
                modeProjectedTravel = travel.pedestrian.projected;
              }
            break;
            case 'all':
              modeProjectedTravel = travel.totalProjected;
            break;
            case 'vehicle':
              // WHAT TO USE HERE?
              // skip for now...
              // console.log(`Skipping because of vehicle`);
              continue;
            default:
              console.log(`Unknown effect mode: ${effect.mode}!`);
              continue;
          }

          if(!modeProjectedTravel) {
            continue;
          }

          if(effect.units === 'percent') {

            if(!(effect.parameter in miles)) {
              miles[effect.parameter] = {
                'lower': 0,
                'mean': 0,
                'upper': 0,
              };
            }

            if(!(effect.parameter in percents)) {
              percents[effect.parameter] = {
                'lower': 0,
                'mean': 0,
                'upper': 0,
              };
            }


              if(effect.lower) {
                miles[effect.parameter].lower += modeProjectedTravel.lower * share * (1 + (effect.lower / 100)) * 365;
                percents[effect.parameter].lower += effect.lower * share;
              }
              if(effect.mean) {
                miles[effect.parameter].mean += modeProjectedTravel.mean * share * (1 + (effect.mean / 100)) * 365;
                percents[effect.parameter].mean += effect.mean * share;
              }
              if(effect.upper) {
                miles[effect.parameter].upper += modeProjectedTravel.upper * share * (1 + (effect.upper / 100)) * 365;
                percents[effect.parameter].upper += effect.upper * share;
              }
          }
          else if(effect.units === 'mph') {
            // WHAT TO DO HERE?
            // skip for now...
            // console.log(`Skipping because of mph`);
            continue;
          }
          else {
            console.log(`Unknown effect units: ${effect.units}!`);
            continue;
          }

        }

      }

    }

  }

  let parameters = [
    "crashes",
    "crime",
    "deaths",
    "injuries",
    "speed",
    "yielding",
  ];

  for(let parameter of parameters) {

    if(!(parameter in miles)) {
      miles[parameter] = {
        'lower': NaN,
        'mean': NaN,
        'upper': NaN,
      };
    }

    if(!(parameter in percents)) {
      percents[parameter] = {
        'lower': NaN,
        'mean': NaN,
        'upper': NaN,
      };
    }
  }

  return {
    'miles': miles,
    'percents': percents,
  };
}

function calcSafetyQuantitative(infrastructure, travel, length, intersections, subtype) {

  return {
    "miles": _calc(infrastructure, travel.miles, length, intersections, subtype),
    "capita": _calc(infrastructure, travel.capita, length, intersections, subtype),
    "jobs": _calc(infrastructure, travel.jobs, length, intersections, subtype),
  }

}

export default calcSafetyQuantitative;
