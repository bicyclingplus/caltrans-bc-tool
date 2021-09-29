const demand_volume = require('../data/demand_volume.json');

const INDUCED_TRAVEL = {
    'bike': 11.8,
    'pedestrian': 49.95,
};

const ROUTE_SHIFT = {
    'bike': 58.81,
    'pedestrian': 0,
};

const CAR_SHIFT = {
    'bike': 17.64,
    'pedestrian': 24.41,
};

function calcDemandMode(mode, infrastructure, subtype, existingDemand, corridors) {

    let demand = {};

    demand.existing = {
        'lower': existingDemand[mode].lower,
        'mean': existingDemand[mode].mean,
        'upper': existingDemand[mode].upper,
    }

    let increases = [];

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

                        if(mode in demand_volume[demandElement]) {

                            // console.log(`Adding demand increase for ${mode} for ${demandElement}`);

                            let share = element.count / corridors;

                            // console.log(`Share is ${share}`);

                            increases.push({
                                'lower': ((demand_volume[demandElement][mode].lower / 100) * existingDemand[mode].lower) * share,
                                'mean': ((demand_volume[demandElement][mode].mean / 100) * existingDemand[mode].mean) * share,
                                'upper': ((demand_volume[demandElement][mode].upper / 100) * existingDemand[mode].upper) * share,
                            });

                        }
                    }
                }

            }
        }
    }

    // console.log(increases);

    let weighted = {
        'lower': 0,
        'mean': 0,
        'upper': 0,
    };

    for(let i = 0; i < increases.length; i++) {
        weighted.lower += increases[i].lower;
        weighted.mean += increases[i].mean;
        weighted.upper += increases[i].upper;
    }

    if(increases.length) {
        weighted.lower /= increases.length;
        weighted.mean /= increases.length;
        weighted.upper /= increases.length;
    }

    // console.log(weighted);

    demand.inducedTravel =  {
        'lower': weighted.lower * INDUCED_TRAVEL[mode] / 100,
        'mean': weighted.mean * INDUCED_TRAVEL[mode] / 100,
        'upper': weighted.upper * INDUCED_TRAVEL[mode] / 100,
    };

    demand.routeShift =  {
        'lower': weighted.lower * ROUTE_SHIFT[mode] / 100,
        'mean': weighted.mean * ROUTE_SHIFT[mode] / 100,
        'upper': weighted.upper * ROUTE_SHIFT[mode] / 100,
    };

    demand.carShift =  {
        'lower': weighted.lower * CAR_SHIFT[mode] / 100,
        'mean': weighted.mean * CAR_SHIFT[mode] / 100,
        'upper': weighted.upper * CAR_SHIFT[mode] / 100,
    };

    demand.residual = {
        'lower': weighted.lower - demand.inducedTravel.lower - demand.routeShift.lower - demand.carShift.lower,
        'mean': weighted.mean - demand.inducedTravel.mean - demand.routeShift.mean - demand.carShift.mean,
        'upper': weighted.upper - demand.inducedTravel.upper - demand.routeShift.upper - demand.carShift.upper,
    }

    demand.total = weighted;

    demand.projected = {
        'lower': demand.existing.lower + demand.total.lower,
        'mean': demand.existing.mean + demand.total.mean,
        'upper': demand.existing.upper + demand.total.upper,
    }

    return demand;
}

function calcDemand(infrastructure, subtype, existingDemand, corridors) {

    let demand = {
        "totalProjected": {
            "lower": 0,
            "mean": 0,
            "upper": 0,
        }
    };

    if(subtype !== "pedestrian-only") {
        demand.bike = calcDemandMode('bike', infrastructure, subtype, existingDemand, corridors);

        demand.totalProjected.lower += demand.bike.projected.lower;
        demand.totalProjected.mean += demand.bike.projected.mean;
        demand.totalProjected.upper += demand.bike.projected.upper;
    }

    demand.pedestrian = calcDemandMode('pedestrian', infrastructure, subtype, existingDemand, corridors);

    demand.totalProjected.lower += demand.pedestrian.projected.lower;
    demand.totalProjected.mean += demand.pedestrian.projected.mean;
    demand.totalProjected.upper += demand.pedestrian.projected.upper;

    return demand;

}

export default calcDemand;
