import { SCALING_FACTORS } from './constants';

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

function calcTravelMode(mode, infrastructure, selectedInfrastructure,
    existingTravel, project_length, num_intersections) {

    let travel = {};

    travel.existing = {
        'lower': existingTravel.lower,
        'mean': existingTravel.mean,
        'upper': existingTravel.upper,
    }

    let increases = [];

    for(let category of infrastructure.categories) {

        for(let item of category.items) {


            if(item.shortname in selectedInfrastructure &&
                item.shortname in travel_volume &&
                mode in travel_volume[item.shortname]) {

                for(let type in SCALING_FACTORS) {

                    let value = selectedInfrastructure[item.shortname][type];

                    if(value === 0) {
                        continue;
                    }

                    let share = 0;
                    let multiplier = SCALING_FACTORS[type];

                    if(item.calc_units === 'length') {

                        if(item.units === 'count') {
                            // In this case we ask them for a count and
                            // then apply a preset length per item
                            // i.e. lights every 100 feet
                            // and then apply that as a portion of the
                            // total project length
                            // all are assumed to be per 100 feet right now
                            // this will probably change at some point.
                            share = (value * 100) / project_length;
                        }
                        else if(item.units === 'length') {
                            share = value / project_length;
                        }
                    }
                    else if(item.calc_units === 'count') {
                        share = value / num_intersections;
                    }

                    increases.push({
                        'lower': ((travel_volume[item.shortname][mode].lower / 100) * travel.existing.lower) * share * multiplier,
                        'mean': ((travel_volume[item.shortname][mode].mean / 100) * travel.existing.mean) * share * multiplier,
                        'upper': ((travel_volume[item.shortname][mode].upper / 100) * travel.existing.upper) * share * multiplier,
                    });

                }

            }
        }
    }

    console.log(increases);

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

function calcTravel(infrastructure, selectedInfrastructure, existingTravel,
    project_length, num_intersections) {

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

    travel.miles.bike = calcTravelMode(
        'bike',
        infrastructure,
        selectedInfrastructure,
        existingTravel.miles.bike,
        project_length,
        num_intersections);

    travel.miles.pedestrian = calcTravelMode(
        'pedestrian',
        infrastructure,
        selectedInfrastructure,
        existingTravel.miles.pedestrian,
        project_length,
        num_intersections);

    travel.miles.totalProjected.lower += travel.miles.bike.projected.lower;
    travel.miles.totalProjected.mean += travel.miles.bike.projected.mean;
    travel.miles.totalProjected.upper += travel.miles.bike.projected.upper;

    travel.miles.totalProjected.lower += travel.miles.pedestrian.projected.lower;
    travel.miles.totalProjected.mean += travel.miles.pedestrian.projected.mean;
    travel.miles.totalProjected.upper += travel.miles.pedestrian.projected.upper;

    travel.capita.bike = calcTravelMode(
        'bike',
        infrastructure,
        selectedInfrastructure,
        existingTravel.capita.bike,
        project_length,
        num_intersections);

    travel.capita.pedestrian = calcTravelMode(
        'pedestrian',
        infrastructure,
        selectedInfrastructure,
        existingTravel.capita.pedestrian,
        project_length,
        num_intersections);

    travel.capita.totalProjected.lower += travel.capita.bike.projected.lower;
    travel.capita.totalProjected.mean += travel.capita.bike.projected.mean;
    travel.capita.totalProjected.upper += travel.capita.bike.projected.upper;

    travel.capita.totalProjected.lower += travel.capita.pedestrian.projected.lower;
    travel.capita.totalProjected.mean += travel.capita.pedestrian.projected.mean;
    travel.capita.totalProjected.upper += travel.capita.pedestrian.projected.upper;

    travel.jobs.bike = calcTravelMode(
        'bike',
        infrastructure,
        selectedInfrastructure,
        existingTravel.jobs.bike,
        project_length,
        num_intersections);

    travel.jobs.pedestrian = calcTravelMode(
        'pedestrian',
        infrastructure,
        selectedInfrastructure,
        existingTravel.jobs.pedestrian,
        project_length,
        num_intersections);

    travel.jobs.totalProjected.lower += travel.jobs.bike.projected.lower;
    travel.jobs.totalProjected.mean += travel.jobs.bike.projected.mean;
    travel.jobs.totalProjected.upper += travel.jobs.bike.projected.upper;

    travel.jobs.totalProjected.lower += travel.jobs.pedestrian.projected.lower;
    travel.jobs.totalProjected.mean += travel.jobs.pedestrian.projected.mean;
    travel.jobs.totalProjected.upper += travel.jobs.pedestrian.projected.upper;

    return travel;

}

export default calcTravel;
