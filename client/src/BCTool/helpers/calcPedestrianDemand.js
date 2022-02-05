// Code below taken from https://github.com/gautama-bharadwaj/volume_to_miles
// and ported to JS by me
// JSON file required below also taken from the same repo
// Input of 1.8, 10, 1234 should yield output of 258.42, verified

const pedestrianDemand = require('../data/pedestrian_demand.json');

const calcPedestrianDemand = (proj_distance, proj_intersections, proj_volume) => {

	// Original function expects project distance in miles, tool stores it in feet
	proj_distance /= 5280;

	// Get data from the lookup table in config.json
	let miles_distribution = pedestrianDemand.miles_walked;

	// Calculating the average distance per intersection for the project
	let proj_distance_per_intersection = proj_distance/proj_intersections;

	// Convert miles into intersections
    let intersection_distribution = {};
    let distribution_den = 0;

    for(let dist in miles_distribution) {

    	intersection_distribution[dist] = Math.floor(parseFloat(dist)/proj_distance_per_intersection);

    	// If on average people walk more than the number of intersections in the project,
    	// then consider they have walked through all of the project intersections
    	if(intersection_distribution[dist] > proj_intersections) {
    		intersection_distribution[dist] = proj_intersections;
    	}

    	// Distribution of people walking through intersections
    	distribution_den += intersection_distribution[dist]*miles_distribution[dist];
    }

    let people = Math.floor(proj_volume/distribution_den);

    // Calculating the distance walked in the project
    let distance = 0;

    for(let dist in  miles_distribution) {
    	if(parseFloat(dist)>proj_distance) {
    		distance += proj_distance*miles_distribution[dist]*people;
    	}
    	else {
    		distance += parseFloat(dist)*miles_distribution[dist]*people;
    	}
    }

    // return Math.round((distance + Number.EPSILON) * 100) / 100;
    // Changed the original rounding to match bike demand
    return Math.round(distance + Number.EPSILON);
};

export default calcPedestrianDemand;