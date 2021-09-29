const quantitative = require('../data/quantitative.json');

function calcSafetyQuantitative(infrastructure, demand, corridors, intersections) {

  // for each parameter
  // create a dict init count  for lower mean and upper;
  let counts = {};

  for(let parameter of quantitative.parameters) {
    counts[parameter.shortname] = {
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
        // intersection will have corridor 0, so no effect
        // corridor will have intersection 0, so no effect
        let corridorFraction = item.counts.corridors / corridors;
        let intersectionFraction = item.counts.intersections / intersections;

        let benefit = quantitative.benefits[item.shortname];

        for(let effect of benefit.effects) {

          // console.log(`Calculating benefit for ${effect.mode} ${effect.parameter}`);

          let modeProjectedDemand;

          switch(effect.mode) {
            case 'bike':
              modeProjectedDemand = demand.bike.projected;
            break;
            case 'pedestrian':
              modeProjectedDemand = demand.pedestrian.projected;
            break;
            case 'all':
              modeProjectedDemand = demand.totalProjected;
            break;
            case 'vehicle':
              // WHAT TO USE HERE?
              // skip for now...
              continue;
            default:
              console.log(`Unknown effect mode: ${effect.mode}!`);
              continue;
          }

          if(effect.units === 'percent') {

            if(corridors) {
              counts[effect.parameter].lower += modeProjectedDemand.lower * corridorFraction * (1 + (effect.lower / 100));
              counts[effect.parameter].mean += modeProjectedDemand.mean * corridorFraction * (1 + (effect.mean / 100));
              counts[effect.parameter].upper += modeProjectedDemand.upper * corridorFraction * (1 + (effect.upper / 100));
            }

            if(intersections) {
              counts[effect.parameter].lower += modeProjectedDemand.lower * intersectionFraction * (1 + (effect.lower / 100));
              counts[effect.parameter].mean += modeProjectedDemand.mean * intersectionFraction * (1 + (effect.mean / 100));
              counts[effect.parameter].upper += modeProjectedDemand.upper * intersectionFraction * (1 + (effect.upper / 100));
            }
          }
          else if(effect.units === 'mph') {
            // WHAT TO DO HERE?
            // skip for now...
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

  return quantitative.parameters.map((parameter) => ({
    'label': parameter.label,
    'shortname': parameter.shortname,
    'lower': counts[parameter.shortname].lower,
    'mean': counts[parameter.shortname].mean,
    'upper': counts[parameter.shortname].upper,
  }));
}

export default calcSafetyQuantitative;
