const quantitative = require('../data/quantitative.json');

function calcSafetyQuantitative(infrastructure, travel, blockFaces, intersections) {

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

  let counts = {};

  for(let parameter of parameters) {
    counts[parameter] = {
      'lower': 0,
      'mean': 0,
      'upper': 0,
    }
  }

  // for each category
  for(let category of infrastructure.categories) {

    // for each item
    for(let item of category.items) {

      // check if item has an entry in benefits
      if(item.shortname in quantitative.benefits) {

        // console.log(`Found quantitative safety benefits for ${item.label}`);

        // calc fraction of counts for this item compared to project counts
        // amenity could have value for both
        // intersection will have blockFace 0, so no effect
        // blockFace will have intersection 0, so no effect
        let blockFaceFraction = item.counts.blockFaces / blockFaces;
        let intersectionFraction = item.counts.intersections / intersections;

        let benefit = quantitative.benefits[item.shortname];

        for(let effect of benefit.effects) {

          // console.log(`Calculating benefit for ${effect.mode} ${effect.parameter}`);

          let modeProjectedTravel;

          switch(effect.mode) {
            case 'bike':
              modeProjectedTravel = travel.bike.projected;
            break;
            case 'pedestrian':
              modeProjectedTravel = travel.pedestrian.projected;
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

          if(effect.units === 'percent') {

            if(blockFaces) {
              if(effect.lower) {
                counts[effect.parameter].lower += modeProjectedTravel.lower * blockFaceFraction * (1 + (effect.lower / 100)) * 365;
              }
              if(effect.mean) {
                counts[effect.parameter].mean += modeProjectedTravel.mean * blockFaceFraction * (1 + (effect.mean / 100)) * 365;
              }
              if(effect.upper) {
                counts[effect.parameter].upper += modeProjectedTravel.upper * blockFaceFraction * (1 + (effect.upper / 100)) * 365;
              }
            }

            if(intersections) {
              if(effect.lower) {
                counts[effect.parameter].lower += modeProjectedTravel.lower * intersectionFraction * (1 + (effect.lower / 100)) * 365;
              }
              if(effect.mean) {
                counts[effect.parameter].mean += modeProjectedTravel.mean * intersectionFraction * (1 + (effect.mean / 100)) * 365;
              }
              if(effect.upper) {
                counts[effect.parameter].upper += modeProjectedTravel.upper * intersectionFraction * (1 + (effect.upper / 100)) * 365;
              }
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

  return counts;
}

export default calcSafetyQuantitative;
