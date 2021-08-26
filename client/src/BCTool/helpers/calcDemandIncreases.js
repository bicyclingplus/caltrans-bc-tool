const demand_volume = require('../data/demand_volume.json');

function calcDemandIncreases(infrastructure, subtype, demand) {

    let demandIncreases = {},
        validTypes = [];

    if(subtype === "both") {
      validTypes = ['bike', 'pedestrian'];
    }
    else if(subtype === "pedestrian-only") {
      validTypes = ['pedestrian'];
    }

    // Go through each infrastructure category
    for(let category in infrastructure) {

      // Go through each infrastructure element in this category
      for(const element of infrastructure[category]) {

        // Check if this element is selected
        if(element['selected']) {

          // Check the current infrastructure element has a demand
          // increase to calculate
          for(let demandElement in demand_volume) {

            if(demandElement === element['shortname']) {

              // add this element to output object if it doesn't already exist
              if(!(demandElement in demandIncreases)) {
                demandIncreases[demandElement] = {};
              }

              // Check if this infrastructure element has a demand
              // increase to calculate for this demand type
              for(const demandType of validTypes) {

                if(demandType in demand_volume[demandElement]) {

                  let demandIncrease = {
                    'name': element['label'],
                  };

                  let calculated = demand_volume[demandElement][demandType]['calculated'];
                  let effect = demand_volume[demandElement][demandType]['effect'];
                  let currentDemand = demand[demandType];

                  // Calculated ones have a lower, mean, and upper effect
                  if(calculated) {
                    demandIncrease['lower'] = (effect['calculated']['lower'] / 100) * currentDemand['lower'];
                    demandIncrease['mean'] =  (effect['calculated']['mean'] / 100) * currentDemand['mean'];
                    demandIncrease['upper'] = (effect['calculated']['upper'] / 100) * currentDemand['upper'];
                  }
                  // Otherwise we only have a given mean effect
                  else {
                    demandIncrease['lower'] = null;
                    demandIncrease['mean'] =  (effect['mean'] / 100) * currentDemand['mean'];
                    demandIncrease['upper'] = null;
                  }

                  demandIncreases[demandElement][demandType] = demandIncrease;
                }
              }
            }
          }
        }
      }
    }

    return demandIncreases;
}

export default calcDemandIncreases;