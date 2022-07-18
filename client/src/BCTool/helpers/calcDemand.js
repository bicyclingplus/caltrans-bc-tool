// Code below taken from https://github.com/gautama-bharadwaj/volume_to_miles/blob/master/miles.py#L4
// and ported to JS by me
// JSON file required below also taken from the same repo
// Input of 1.8, 10, 1234 should yield output of 258.42, verified
const pedestrianConfig = require('../data/pedestrian_config.json');

const weightPedestrianDemand = (proj_distance, proj_intersections, proj_volume) => {

	// Get data from the lookup table in config.json
	let miles_distribution = pedestrianConfig.miles_walked;

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

const calcPedDemand = (existingTravel, selectedIntersections, userIntersections, projectLength) => {

	// Grab the averages
    // Avg lower/mean/upper/pops/jobs used for user defined intersections
    // let intersectionLower = [];
    let intersectionAvg = [];
    // let intersectionUpper = [];
    let intersectionPops = [];
    let intersectionJobs = [];

    for(let intersection of selectedIntersections) {
      // if(intersection.properties.low_pred) {
      //   intersectionLower.push(parseInt(intersection.properties.low_pred));
      // }
      if(intersection.properties.ped_demand) {
        intersectionAvg.push(parseInt(intersection.properties.ped_demand));
      }
      // if(intersection.properties.high_pred) {
      //   intersectionUpper.push(parseInt(intersection.properties.high_pred));
      // }
      if(intersection.properties.population) {
        intersectionPops.push(parseInt(intersection.properties.population));
      }
      if(intersection.properties.jobs) {
        intersectionJobs.push(parseInt(intersection.properties.jobs));
      }
    }

    // let avgIntersectionLower = intersectionLower.length ? intersectionLower.reduce((a,b) => a+b) / intersectionLower.length : null;
    let avgIntersectionAvg = intersectionAvg.length ? intersectionAvg.reduce((a,b) => a+b) / intersectionAvg.length : null;
    // let avgIntersectionUpper = intersectionUpper.length ? intersectionUpper.reduce((a,b) => a+b) / intersectionUpper.length : null;
    let avgIntersectionPops = intersectionPops.length ? intersectionPops.reduce((a,b) => a+b) / intersectionPops.length : null;
    let avgIntersectionJobs = intersectionJobs.length ? intersectionJobs.reduce((a,b) => a+b) / intersectionJobs.length : null;


    // CALCULATE PEDESTRIAN DEMAND FOR USER SELECTED INTERSECTIONS
    // each selected intersection has some prediction of pedestrian demand,
    // we add these to the total here
    for(let intersection of selectedIntersections) {

      // let lower = parseInt(intersection.properties.low_pred);
      let mean = parseInt(intersection.properties.ped_demand);
      // let upper = parseInt(intersection.properties.high_pred);
      let population = intersection.properties.population;
      let jobs = intersection.properties.jobs;

      // existingTravel.miles.pedestrian.lower += lower;
      existingTravel.miles.pedestrian.mean += mean;
      // existingTravel.miles.pedestrian.upper += upper;

      // existingTravel.capita.pedestrian.lower += lower / population;
      existingTravel.capita.pedestrian.mean += mean / population;
      // existingTravel.capita.pedestrian.upper += upper / population;

      // existingTravel.jobs.pedestrian.lower += lower / jobs;
      existingTravel.jobs.pedestrian.mean += mean / jobs;
      // existingTravel.jobs.pedestrian.upper += upper / jobs;

    }

    // CALCULATE PEDESTRIAN DEMAND FOR USER DEFINED INTERSECTIONS
    // user defined intersections won't have the necessary properties, so we use averages
    // since they're all the same no need to loop through, just multiply by the
    // number of user defined intersections
    // existingTravel.miles.pedestrian.lower += avgIntersectionLower * userIntersections.length;
    existingTravel.miles.pedestrian.mean += avgIntersectionAvg * userIntersections.length;
    // existingTravel.miles.pedestrian.upper += avgIntersectionUpper * userIntersections.length;

    // existingTravel.capita.pedestrian.lower += (avgIntersectionLower * userIntersections.length) / avgIntersectionPops;
    existingTravel.capita.pedestrian.mean += (avgIntersectionAvg * userIntersections.length) / avgIntersectionPops;
    // existingTravel.capita.pedestrian.upper += (avgIntersectionUpper * userIntersections.length) / avgIntersectionPops;

    // existingTravel.jobs.pedestrian.lower += (avgIntersectionLower * userIntersections.length) / avgIntersectionJobs;
    existingTravel.jobs.pedestrian.mean += (avgIntersectionAvg * userIntersections.length) / avgIntersectionJobs;
    // existingTravel.jobs.pedestrian.upper += (avgIntersectionUpper * userIntersections.length) / avgIntersectionJobs;

    // then the pedestrian demand is weighted by the project length and
    // number of intersections
    let projectLengthMiles = projectLength / 5280;
    let numIntersections = selectedIntersections.length + userIntersections.length;

    if(numIntersections > 0) {

      // existingTravel.miles.pedestrian.lower = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.miles.pedestrian.lower);
      existingTravel.miles.pedestrian.mean = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.miles.pedestrian.mean);
      // existingTravel.miles.pedestrian.upper = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.miles.pedestrian.upper);

      // existingTravel.capita.pedestrian.lower = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.capita.pedestrian.lower);
      existingTravel.capita.pedestrian.mean = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.capita.pedestrian.mean);
      // existingTravel.capita.pedestrian.upper = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.capita.pedestrian.upper);

      // existingTravel.jobs.pedestrian.lower = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.jobs.pedestrian.lower);
      existingTravel.jobs.pedestrian.mean = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.jobs.pedestrian.mean);
      // existingTravel.jobs.pedestrian.upper = weightPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.jobs.pedestrian.upper);
    }

    return existingTravel;

}

const calcBikeDemand = (existingTravel, selectedWays, userWays) => {

	// AVERAGE NEEDED PROPERTIES FOR USER SELECTED WAYS
    // Avg lower/mean/upper used for user defined ways
    // Avg pops/jobs used for user selected ways that are missing
    // these properties as well as user defined ways
    // let wayLower = [];
    let wayAvg = [];
    // let wayUpper = [];
    let wayPops = [];
    let wayJobs = [];

    for(let way of selectedWays) {
      // if(way.properties.low_daily) {
      //   wayLower.push(parseInt(way.properties.low_daily));
      // }
      if(way.properties.bicyclist_demand) {
        wayAvg.push(parseInt(way.properties.bicyclist_demand));
      }
      // if(way.properties.high_daily) {
      //   wayUpper.push(parseInt(way.properties.high_daily));
      // }
      if(way.properties.jobs) {
        wayJobs.push(way.properties.jobs);
      }
      if(way.properties.population) {
        wayPops.push(way.properties.population);
      }
    }

    // let avgWayLower = wayLower.length ? wayLower.reduce((a,b) => a+b) / wayLower.length : null;
    let avgWayAvg = wayAvg.length ? wayAvg.reduce((a,b) => a+b) / wayAvg.length : null;
    // let avgWayUpper = wayUpper.length ? wayUpper.reduce((a,b) => a+b) / wayUpper.length : null;
    let avgWayPop = wayPops.length ? wayPops.reduce((a,b) => a+b) / wayPops.length : null;
    let avgWayJobs = wayPops.length ? wayJobs.reduce((a,b) => a+b) / wayJobs.length : null;

    // Array of demand objects per user selected or user defined way
    let waysTravel = [];

    // CALCULATE BIKE DEMAND PER USER SELECTED WAY
    for(let way of selectedWays) {

      let current = {
        'miles': {},
        'capita': {},
        'jobs': {},
      };

      // let lower = parseInt(way.properties.low_daily);
      let mean = parseInt(way.properties.bicyclist_demand);
      // let upper = parseInt(way.properties.high_daily);

      // use properties for this way or the average of all selected ways if missing
      let population = way.properties.population ? way.properties.population : avgWayPop;
      let jobs = way.properties.Jobs ? way.properties.jobs : avgWayJobs;

      // demand calcs all based on miles so convert feet -> miles here
      let wayLengthMiles = way.properties.length / 5280;

      // current.miles.lower = lower * wayLengthMiles;
      current.miles.mean = mean * wayLengthMiles;
      // current.miles.upper = upper * wayLengthMiles;

      // divide by population for per capita
      // current.capita.lower = current.miles.lower / population;
      current.capita.mean = current.miles.mean / population;
      // current.capita.upper = current.miles.upper / population;

      // divide by jobs for per jobs
      // current.jobs.lower = current.miles.lower / jobs;
      current.jobs.mean = current.miles.mean / jobs;
      // current.jobs.upper = current.miles.upper / jobs;

      waysTravel.push(current);
    }

    // CALCULATE BIKE DEMAND PER USER DEFINED WAY
    for(let way of userWays) {

      let current = {
        'miles': {},
        'capita': {},
        'jobs': {},
      };

      // demand calcs all based on miles so convert feet -> miles here
      let wayLengthMiles = way.properties.length / 5280;

      // use averages for everything here because user defined ways
      // won't have any of these properties
      // current.miles.lower = avgWayLower * wayLengthMiles;
      current.miles.mean = avgWayAvg * wayLengthMiles;
      // current.miles.upper = avgWayUpper * wayLengthMiles;

      // current.capita.lower = current.miles.lower / avgWayPop;
      current.capita.mean = current.miles.mean / avgWayPop;
      // current.capita.upper = current.miles.upper / avgWayPop;

      // current.jobs.lower = current.miles.lower / avgWayJobs;
      current.jobs.mean = current.miles.mean / avgWayJobs;
      // current.jobs.upper = current.miles.upper / avgWayJobs;

      waysTravel.push(current);
    }

    // grab total bike demand by summing all ways
    for(let travel of waysTravel) {
      // existingTravel.miles.bike.lower += travel.miles.lower;
      existingTravel.miles.bike.mean += travel.miles.mean;
      // existingTravel.miles.bike.upper += travel.miles.upper;

      // existingTravel.capita.bike.lower += travel.capita.lower;
      existingTravel.capita.bike.mean += travel.capita.mean;
      // existingTravel.capita.bike.upper += travel.capita.upper;

      // existingTravel.jobs.bike.lower += travel.jobs.lower;
      existingTravel.jobs.bike.mean += travel.jobs.mean;
      // existingTravel.jobs.bike.upper += travel.jobs.upper;
    }

    return existingTravel;

}

const calcDemand = (selectedWays, userWays, selectedIntersections, userIntersections, projectLength) => {
	let existingTravel = {
      "miles": {
        "bike": {
          // 'lower': 0,
          'mean': 0,
          // 'upper': 0,
        },
        "pedestrian": {
          // 'lower': 0,
          'mean': 0,
          // 'upper': 0,
        }
      },
      "capita":  {
        "bike": {
          // 'lower': 0,
          'mean': 0,
          // 'upper': 0,
        },
        "pedestrian": {
          // 'lower': 0,
          'mean': 0,
          // 'upper': 0,
        }
      },
      "jobs":  {
        "bike": {
          // 'lower': 0,
          'mean': 0,
          // 'upper': 0,
        },
        "pedestrian": {
          // 'lower': 0,
          'mean': 0,
          // 'upper': 0,
        }
      },
    };

    calcBikeDemand(existingTravel, selectedWays, userWays);

    calcPedDemand(existingTravel, selectedIntersections, userIntersections, projectLength);

    return existingTravel;
}

export default calcDemand;