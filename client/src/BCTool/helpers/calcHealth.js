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

function _calc(travel) {

  let benefits = {
    'total': {
      'lower': 0,
      'mean': 0,
      'upper': 0,
    }
  };

  // Calculate health benefits
  // (travel increase in miles / speed in mph)
  //    * Marginal Metabolic Equivalent of Task (MMET) per hour
  // yields MMET

  benefits.pedestrian = {};

  benefits.pedestrian.lower = ((travel.pedestrian.inducedTravel.lower * 365) / WALK_SPEED.lower) * WALK_MMET.lower;
  benefits.pedestrian.mean = ((travel.pedestrian.inducedTravel.mean * 365) / WALK_SPEED.mean) * WALK_MMET.mean;
  benefits.pedestrian.upper = ((travel.pedestrian.inducedTravel.upper * 365) / WALK_SPEED.upper) * WALK_MMET.upper;

  benefits.total.lower += benefits.pedestrian.lower;
  benefits.total.mean += benefits.pedestrian.mean;
  benefits.total.upper += benefits.pedestrian.upper;


  benefits.bike = {};

  benefits.bike.lower = ((travel.bike.inducedTravel.lower * 365) / BIKE_SPEED.lower) * BIKE_MMET.lower;
  benefits.bike.mean = ((travel.bike.inducedTravel.mean * 365) / BIKE_SPEED.mean) * BIKE_MMET.mean;
  benefits.bike.upper = ((travel.bike.inducedTravel.upper * 365) / BIKE_SPEED.upper) * BIKE_MMET.upper;

  benefits.total.lower += benefits.bike.lower;
  benefits.total.mean += benefits.bike.mean;
  benefits.total.upper += benefits.bike.upper;

  return benefits;

}

function calcHealth(travel) {

  return {
    'miles': _calc(travel.miles),
    'capita': _calc(travel.capita),
    'jobs': _calc(travel.jobs),
  }

}

export default calcHealth;
