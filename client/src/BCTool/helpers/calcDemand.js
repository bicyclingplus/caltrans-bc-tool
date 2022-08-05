// Code below taken from https://github.com/gautama-bharadwaj/volume_to_miles/blob/master/miles.py#L4
// and ported to JS by me
// JSON file required below also taken from the same repo
// Input of 1.8, 10, 1234 should yield output of 258.42, verified
const config = require('../data/volume_to_miles.json');

const _weightDemand = (
  proj_distance,
  proj_units,
  proj_volume,
  miles_distribution) => {

	// Calculating the average distance per intersection for the project
	let proj_distance_per_unit = proj_distance/proj_units;

	// Convert miles into intersections
    let unit_distribution = {};
    let distribution_den = 0;

    for(let dist in miles_distribution) {

    	unit_distribution[dist] = Math.floor(parseFloat(dist)/proj_distance_per_unit);

    	// If on average people walk more than the number of intersections in the project,
    	// then consider they have walked through all of the project intersections
    	if(unit_distribution[dist] > proj_units) {
    		unit_distribution[dist] = proj_units;
    	}

    	// Distribution of people walking through intersections
    	distribution_den += unit_distribution[dist]*miles_distribution[dist];
    }

    let people = Math.floor(proj_volume/distribution_den);

    // Calculating the distance walked in the project
    let distance = 0;

    for(let dist in miles_distribution) {
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

const _calcPedDemand = (
  existingTravel,
  selectedIntersections,
  userIntersections,
  projectLength) => {

    // Grab the averages
    // Avg lower/mean/upper/pops/jobs used for user defined intersections
    let intersectionAvg = [];
    let intersectionPops = [];
    let intersectionJobs = [];

    for(let intersection of selectedIntersections) {
      if(intersection.properties.ped_demand) {
        intersectionAvg.push(parseInt(intersection.properties.ped_demand));
      }
      if(intersection.properties.population) {
        intersectionPops.push(parseInt(intersection.properties.population));
      }
      if(intersection.properties.jobs) {
        intersectionJobs.push(parseInt(intersection.properties.jobs));
      }
    }

    let avgIntersectionAvg = intersectionAvg.length ? intersectionAvg.reduce((a,b) => a+b) / intersectionAvg.length : null;
    let avgIntersectionPops = intersectionPops.length ? intersectionPops.reduce((a,b) => a+b) / intersectionPops.length : null;
    let avgIntersectionJobs = intersectionJobs.length ? intersectionJobs.reduce((a,b) => a+b) / intersectionJobs.length : null;


    // CALCULATE PEDESTRIAN DEMAND FOR USER SELECTED INTERSECTIONS
    // each selected intersection has some prediction of pedestrian demand,
    // we add these to the total here
    for(let intersection of selectedIntersections) {

      let mean = parseInt(intersection.properties.ped_demand);
      let population = intersection.properties.population;
      let jobs = intersection.properties.jobs;

      existingTravel.miles.pedestrian.mean += mean;
      existingTravel.capita.pedestrian.mean += mean / population;
      existingTravel.jobs.pedestrian.mean += mean / jobs;
    }

    // CALCULATE PEDESTRIAN DEMAND FOR USER DEFINED INTERSECTIONS
    // user defined intersections won't have the necessary properties, so we use averages
    // since they're all the same no need to loop through, just multiply by the
    // number of user defined intersections
    existingTravel.miles.pedestrian.mean += avgIntersectionAvg * userIntersections.length;
    existingTravel.capita.pedestrian.mean += (avgIntersectionAvg * userIntersections.length) / avgIntersectionPops;
    existingTravel.jobs.pedestrian.mean += (avgIntersectionAvg * userIntersections.length) / avgIntersectionJobs;

    // then the pedestrian demand is weighted by the project length and
    // number of intersections
    let projectLengthMiles = projectLength / 5280;
    let numIntersections = selectedIntersections.length + userIntersections.length;

    if(numIntersections > 0) {

      console.log('ped')

      console.log(existingTravel.miles.pedestrian.mean);

      existingTravel.miles.pedestrian.mean = _weightDemand(
        projectLengthMiles,
        numIntersections,
        existingTravel.miles.pedestrian.mean,
        config.pedestrian
      );

      console.log(existingTravel.miles.pedestrian.mean);

      existingTravel.capita.pedestrian.mean = _weightDemand(
        projectLengthMiles,
        numIntersections,
        existingTravel.capita.pedestrian.mean,
        config.pedestrian
      );

      existingTravel.jobs.pedestrian.mean = _weightDemand(
        projectLengthMiles,
        numIntersections,
        existingTravel.jobs.pedestrian.mean,
        config.pedestrian);
    }

    return existingTravel;
}

const _calcBikeDemand = (
  existingTravel,
  selectedWays,
  userWays,
  projectLength) => {

    // AVERAGE NEEDED PROPERTIES FOR USER SELECTED WAYS
    // Avg lower/mean/upper used for user defined ways
    // Avg pops/jobs used for user selected ways that are missing
    // these properties as well as user defined ways
    let wayAvg = [];
    let wayPops = [];
    let wayJobs = [];

    for(let way of selectedWays) {
      if(way.properties.bicyclist_demand) {
        wayAvg.push(parseInt(way.properties.bicyclist_demand));
      }
      if(way.properties.jobs) {
        wayJobs.push(way.properties.jobs);
      }
      if(way.properties.population) {
        wayPops.push(way.properties.population);
      }
    }

    let avgWayAvg = wayAvg.length ? wayAvg.reduce((a,b) => a+b) / wayAvg.length : null;
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

      let mean = parseInt(way.properties.bicyclist_demand);

      // use properties for this way or the average of all selected ways if missing
      let population = way.properties.population ? way.properties.population : avgWayPop;
      let jobs = way.properties.Jobs ? way.properties.jobs : avgWayJobs;

      // demand calcs all based on miles so convert feet -> miles here
      let wayLengthMiles = way.properties.length / 5280;

      current.miles.mean = mean * wayLengthMiles;

      // divide by population for per capita
      current.capita.mean = current.miles.mean / population;

      // divide by jobs for per jobs
      current.jobs.mean = current.miles.mean / jobs;

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
      current.miles.mean = avgWayAvg * wayLengthMiles;

      current.capita.mean = current.miles.mean / avgWayPop;

      current.jobs.mean = current.miles.mean / avgWayJobs;

      waysTravel.push(current);
    }

    // grab total bike demand by summing all ways
    for(let travel of waysTravel) {
      existingTravel.miles.bike.mean += travel.miles.mean;

      existingTravel.capita.bike.mean += travel.capita.mean;

      existingTravel.jobs.bike.mean += travel.jobs.mean;
    }

    // then the bike demand is weighted by the project length and
    // number of ways
    // let projectLengthMiles = projectLength / 5280;
    // let numWays = selectedWays.length + userWays.length;

    // if(numWays > 0) {

    //   console.log('bike');

    //   console.log(existingTravel.miles.bike.mean);

    //   existingTravel.miles.bike.mean = _weightDemand(
    //     projectLengthMiles,
    //     numWays,
    //     existingTravel.miles.bike.mean,
    //     config.bike
    //   );

    //   console.log(existingTravel.miles.bike.mean);

    //   existingTravel.capita.bike.mean = _weightDemand(
    //     projectLengthMiles,
    //     numWays,
    //     existingTravel.capita.bike.mean,
    //     config.bike
    //   );

    //   existingTravel.jobs.bike.mean = _weightDemand(
    //     projectLengthMiles,
    //     numWays,
    //     existingTravel.jobs.bike.mean,
    //     config.bike);
    // }

    // per Dillon email 2022-08-03
    // this is a total hack, but let's just revert to the volume*length
    // and double it for bike miles. I think we can leave the walk
    // calculation as is for now. I'll want to change both of these
    // once I get more brain power to think about them.
    existingTravel.miles.bike.mean *= 2;
    existingTravel.capita.bike.mean *= 2;
    existingTravel.jobs.bike.mean *= 2;

    return existingTravel;

}

const calcDemand = (
  selectedWays,
  userWays,
  selectedIntersections,
  userIntersections,
  projectLength) => {

	let existingTravel = {
      "miles": {
        "bike": {
          'mean': 0,
        },
        "pedestrian": {
          'mean': 0,
        }
      },
      "capita":  {
        "bike": {
          'mean': 0,
        },
        "pedestrian": {
          'mean': 0,
        }
      },
      "jobs":  {
        "bike": {
          'mean': 0,
        },
        "pedestrian": {
          'mean': 0,
        }
      },
    };

    _calcBikeDemand(
      existingTravel,
      selectedWays,
      userWays,
      projectLength);

    _calcPedDemand(
      existingTravel,
      selectedIntersections,
      userIntersections,
      projectLength);

    return existingTravel;
}

export default calcDemand;
