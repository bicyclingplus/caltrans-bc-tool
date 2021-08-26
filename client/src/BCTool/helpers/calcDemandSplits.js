const demand_split = require('../data/demand_split.json');

function calcDemandSplits(demandIncreases) {

    let demandSplits = [];

    for(const element in demandIncreases) {

        if(element in demand_split) {

            for(const splitType in demand_split[element]) {

                let demandIncrease = demandIncreases[element]['bike'];

                let effect = demand_split[element][splitType]['effect'];
                let calculated = demand_split[element][splitType]['calculated'];

                let demandSplit = {
                    "name": demandIncrease['name'],
                    "type": splitType,
                };

                // Calculated ones have a lower, mean, and upper effect
                if(calculated) {

                    let limits = ['lower', 'mean', 'upper'];

                    for(const cur_limit in limits) {
                        if(demandIncrease[cur_limit] !== null) {
                            demandSplit[cur_limit] = (effect['calculated'][cur_limit] / 100) * demandIncrease[cur_limit];
                        }
                        else {
                            demandSplit[cur_limit] = null;
                        }
                    }
                }
                // Otherwise we only have a given mean effect
                else {
                    demandSplit['lower'] = null;
                    demandSplit['mean'] =  (effect['mean'] / 100) * demandIncrease['mean'];
                    demandSplit['upper'] = null;
                }

                demandSplits.push(demandSplit);
            }
        }
    }

    return demandSplits;
}

export default calcDemandSplits;