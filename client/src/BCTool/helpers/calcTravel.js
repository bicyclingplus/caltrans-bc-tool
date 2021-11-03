const travel_volume = require('../data/travel_volume.json');

const INDUCED_TRAVEL = {
    'bike': 11.8,
    'pedestrian': 10.98,
};

const ROUTE_SHIFT = {
    'bike': 58.81,
    'pedestrian': 7.73,
};

const CAR_SHIFT = {
    'bike': 17.64,
    'pedestrian': 33.3,
};

const OTHER_SHIFT = {
    'bike': 11.75,
    'pedestrian': 47.99,
};

const SCALING_FACTOR = 0.1;

function calcTravelMode(mode, infrastructure, subtype, existingTravel, blockFaces) {

    let travel = {};

    travel.existing = {
        'lower': existingTravel[mode].lower,
        'mean': existingTravel[mode].mean,
        'upper': existingTravel[mode].upper,
    }

    let increases = [];

    // Go through each infrastructure category
    for(let category of infrastructure.categories) {

        // Go through each infrastructure element in this category
        for(const item of category.items) {

            // Check if this element is selected
            if(item['selected']) {

                // Check the current infrastructure element has a travel
                // increase to calculate
                for(let element in travel_volume) {

                    if(element === item['shortname']) {

                        if(mode in travel_volume[element]) {

                            // console.log(`Adding travel increase for ${mode} for ${element}`);

                            let share = item.counts.blockFaces / blockFaces;
                            let multiplier = item.type === "retrofit" ? SCALING_FACTOR : 1;

                            // console.log(`Multiplier for ${element} is ${multiplier}`)

                            // console.log(`Share is ${share}`);

                            increases.push({
                                'lower': ((travel_volume[element][mode].lower / 100) * existingTravel[mode].lower) * share * multiplier,
                                'mean': ((travel_volume[element][mode].mean / 100) * existingTravel[mode].mean) * share * multiplier,
                                'upper': ((travel_volume[element][mode].upper / 100) * existingTravel[mode].upper) * share * multiplier,
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

    travel.inducedTravel =  {
        'lower': weighted.lower * INDUCED_TRAVEL[mode] / 100,
        'mean': weighted.mean * INDUCED_TRAVEL[mode] / 100,
        'upper': weighted.upper * INDUCED_TRAVEL[mode] / 100,
    };

    travel.routeShift =  {
        'lower': weighted.lower * ROUTE_SHIFT[mode] / 100,
        'mean': weighted.mean * ROUTE_SHIFT[mode] / 100,
        'upper': weighted.upper * ROUTE_SHIFT[mode] / 100,
    };

    travel.carShift =  {
        'lower': weighted.lower * CAR_SHIFT[mode] / 100,
        'mean': weighted.mean * CAR_SHIFT[mode] / 100,
        'upper': weighted.upper * CAR_SHIFT[mode] / 100,
    };

    travel.otherShift =  {
        'lower': weighted.lower * OTHER_SHIFT[mode] / 100,
        'mean': weighted.mean * OTHER_SHIFT[mode] / 100,
        'upper': weighted.upper * OTHER_SHIFT[mode] / 100,
    };

    travel.total = weighted;

    travel.projected = {
        'lower': travel.existing.lower + travel.total.lower,
        'mean': travel.existing.mean + travel.total.mean,
        'upper': travel.existing.upper + travel.total.upper,
    }

    return travel;
}

function calcTravel(infrastructure, subtype, existingTravel, blockFaces) {

    let travel = {
        "totalProjected": {
            "lower": 0,
            "mean": 0,
            "upper": 0,
        }
    };


    if(subtype !== 'pedestrian-only') {

        travel.bike = calcTravelMode('bike', infrastructure, subtype, existingTravel, blockFaces);

        travel.totalProjected.lower += travel.bike.projected.lower;
        travel.totalProjected.mean += travel.bike.projected.mean;
        travel.totalProjected.upper += travel.bike.projected.upper;
    }

    if(subtype !== 'bike-only') {

        travel.pedestrian = calcTravelMode('pedestrian', infrastructure, subtype, existingTravel, blockFaces);

        travel.totalProjected.lower += travel.pedestrian.projected.lower;
        travel.totalProjected.mean += travel.pedestrian.projected.mean;
        travel.totalProjected.upper += travel.pedestrian.projected.upper;
    }

    return travel;

}

export default calcTravel;
