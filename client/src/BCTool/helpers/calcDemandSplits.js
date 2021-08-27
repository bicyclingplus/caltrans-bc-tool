import { NICE_NAMES } from './formatting';

const demand_split = require('../data/demand_split.json');

function calcDemandSplits(demandIncreases) {

    let demandSplits = [];

    for(const row of demandIncreases) {

        if(row['shortname'] in demand_split && row['shorttype'] === 'bike') {

            for(const type in demand_split[row['shortname']]) {

                let effect = demand_split[row['shortname']][type]['effect'];
                let calculated = demand_split[row['shortname']][type]['calculated'];

                let demandSplit = {
                    "shortname": row['shortname'],
                    "name": row['name'],
                    "shorttype": type,
                    "type": NICE_NAMES[type],
                };

                // Calculated ones have a lower, mean, and upper effect
                if(calculated) {

                    let limits = ['lower', 'mean', 'upper'];

                    for(const cur_limit in limits) {
                        if(row[cur_limit] !== null) {
                            demandSplit[cur_limit] = (effect['calculated'][cur_limit] / 100) * row[cur_limit];
                        }
                        else {
                            demandSplit[cur_limit] = null;
                        }
                    }
                }
                // Otherwise we only have a given mean effect
                else {
                    demandSplit['lower'] = null;
                    demandSplit['mean'] =  (effect['mean'] / 100) * row['mean'];
                    demandSplit['upper'] = null;
                }

                demandSplits.push(demandSplit);
            }
        }
    }

    return demandSplits;
}

export default calcDemandSplits;