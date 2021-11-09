const quantitative = require('../data/quantitative.json');

function calcSafetyQuantitative(infrastructure, travel, length, intersections, subtype) {

  // for each parameter
  // create a dict init count  for lower mean and upper;
  let parameters = [
    "crashes",
    "crime",
    "deaths",
    "injuries",
    "speed",
    "yielding",
  ];

  let miles = {};
  let percents = {};

  for(let parameter of parameters) {
    let zerod = {
      'lower': 0,
      'mean': 0,
      'upper': 0,
    };

    miles[parameter] = {...zerod};
    percents[parameter] = {...zerod};
  }

  // for each category
  for(let category of infrastructure.categories) {

    // for each item
    for(let item of category.items) {

      // check if item has an entry in benefits
      if(item.shortname in quantitative.benefits) {

        // console.log(`Found quantitative safety benefits for ${item.label}`);

        // calc fraction of counts for this item compared to project counts
        let share = 0;
        if(item.units === 'length') {
          share = item.value / length;
        }
        else {
          share = item.value / intersections;
        }

        let benefit = quantitative.benefits[item.shortname];

        for(let effect of benefit.effects) {

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

  return {
    'miles': miles,
    'percents': percents,
  };
}

export default calcSafetyQuantitative;
