const WALK_SPEED = {
  'lower': 1.5,
  'mean': 3.0,
  'upper': 4.5,
};

const BIKE_SPEED = {
  'lower': 5.5,
  'mean': 10.0,
  'upper': 15.0,
};

const WALK_MMET = {
  'lower': 2.0,
  'mean': 2.5,
  'upper': 7.0,
};

const BIKE_MMET = {
  'lower': 2.5,
  'mean': 4.8,
  'upper': 9.0,
};

function calcHealth(subtype, demand) {

  let benefits = {
    'pedestrian': {
      'lower': 0,
      'mean': 0,
      'upper': 0,
    },
    'bike': {
      'lower': 0,
      'mean': 0,
      'upper': 0,
    },
    'total': {
      'lower': 0,
      'mean': 0,
      'upper': 0,
    }
  };

  // Calculate health benefits
  // (demand increase in miles / speed in mph)
  //    * Marginal Metabolic Equivalent of Task (MMET) per hour
  // yields MMET
  benefits.pedestrian.lower = ((demand.pedestrian.inducedTravel.lower * 365) / WALK_SPEED.lower) * WALK_MMET.lower;
  benefits.pedestrian.mean = ((demand.pedestrian.inducedTravel.mean * 365) / WALK_SPEED.mean) * WALK_MMET.mean;
  benefits.pedestrian.upper = ((demand.pedestrian.inducedTravel.upper * 365) / WALK_SPEED.upper) * WALK_MMET.upper;

  // if(subtype !== "pedestrian-only") {
    benefits.bike.lower = ((demand.bike.inducedTravel.lower * 365) / BIKE_SPEED.lower) * BIKE_MMET.lower;
    benefits.bike.mean = ((demand.bike.inducedTravel.mean * 365) / BIKE_SPEED.mean) * BIKE_MMET.mean;
    benefits.bike.upper = ((demand.bike.inducedTravel.upper * 365) / BIKE_SPEED.upper) * BIKE_MMET.upper;
  // }

  benefits.total.lower = benefits.pedestrian.lower + benefits.bike.lower;
  benefits.total.mean = benefits.pedestrian.mean + benefits.bike.mean;
  benefits.total.upper = benefits.pedestrian.upper + benefits.bike.upper;

  return benefits;

}

export default calcHealth;
