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

function calcTravelMode(mode, infrastructure, existingTravel, length) {

    let travel = {};

    travel.existing = {
        'lower': existingTravel.lower,
        'mean': existingTravel.mean,
        'upper': existingTravel.upper,
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

                            // TODO: HOW TO HANDLE THE CASE WHERE THIS IS A COUNT INSTEAD OF A LENGTH?
                            // e.g. CROSSING ISLAND, we ask for count, but how to calculate the share?
                            // it belongs to intersections, so use that?
                            // BUT WHAT ABOUT THE BLOCK FACE STUFF THAT IS IN COUNTS?
                            let share = item.value / length;
                            let multiplier = item.type === "retrofit" ? SCALING_FACTOR : 1;

                            // console.log(`Multiplier for ${element} is ${multiplier}`)

                            // console.log(`Share is ${share}`);

                            increases.push({
                                'lower': ((travel_volume[element][mode].lower / 100) * travel.existing.lower) * share * multiplier,
                                'mean': ((travel_volume[element][mode].mean / 100) * travel.existing.mean) * share * multiplier,
                                'upper': ((travel_volume[element][mode].upper / 100) * travel.existing.upper) * share * multiplier,
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

    // if(increases.length) {
    //     weighted.lower /= increases.length;
    //     weighted.mean /= increases.length;
    //     weighted.upper /= increases.length;
    // }

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

function calcTravel(infrastructure, existingTravel, length) {

    let travel = {
        "miles": {
            "bike": {},
            "pedestrian": {},
            "totalProjected": {
                "lower": 0,
                "mean": 0,
                "upper": 0,
            },
        },
        "capita": {
            "bike": {},
            "pedestrian": {},
            "totalProjected": {
                "lower": 0,
                "mean": 0,
                "upper": 0,
            },
        },
        "jobs": {
            "bike": {},
            "pedestrian": {},
            "totalProjected": {
                "lower": 0,
                "mean": 0,
                "upper": 0,
            },
        },
    };

    travel.miles.bike = calcTravelMode('bike', infrastructure, existingTravel.miles.bike, length);
    travel.miles.pedestrian = calcTravelMode('pedestrian', infrastructure, existingTravel.miles.pedestrian, length);

    travel.miles.totalProjected.lower += travel.miles.bike.projected.lower;
    travel.miles.totalProjected.mean += travel.miles.bike.projected.mean;
    travel.miles.totalProjected.upper += travel.miles.bike.projected.upper;

    travel.miles.totalProjected.lower += travel.miles.pedestrian.projected.lower;
    travel.miles.totalProjected.mean += travel.miles.pedestrian.projected.mean;
    travel.miles.totalProjected.upper += travel.miles.pedestrian.projected.upper;

    travel.capita.bike = calcTravelMode('bike', infrastructure, existingTravel.capita.bike, length);
    travel.capita.pedestrian = calcTravelMode('pedestrian', infrastructure, existingTravel.capita.pedestrian, length);

    travel.capita.totalProjected.lower += travel.capita.bike.projected.lower;
    travel.capita.totalProjected.mean += travel.capita.bike.projected.mean;
    travel.capita.totalProjected.upper += travel.capita.bike.projected.upper;

    travel.capita.totalProjected.lower += travel.capita.pedestrian.projected.lower;
    travel.capita.totalProjected.mean += travel.capita.pedestrian.projected.mean;
    travel.capita.totalProjected.upper += travel.capita.pedestrian.projected.upper;

    travel.jobs.bike = calcTravelMode('bike', infrastructure, existingTravel.jobs.bike, length);
    travel.jobs.pedestrian = calcTravelMode('pedestrian', infrastructure, existingTravel.jobs.pedestrian, length);

    travel.jobs.totalProjected.lower += travel.jobs.bike.projected.lower;
    travel.jobs.totalProjected.mean += travel.jobs.bike.projected.mean;
    travel.jobs.totalProjected.upper += travel.jobs.bike.projected.upper;

    travel.jobs.totalProjected.lower += travel.jobs.pedestrian.projected.lower;
    travel.jobs.totalProjected.mean += travel.jobs.pedestrian.projected.mean;
    travel.jobs.totalProjected.upper += travel.jobs.pedestrian.projected.upper;

    return travel;

}

export default calcTravel;
