import calcDiscount from './calcDiscount';

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

function _calc(travel, time_frame) {

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

  let ped_lower_val = (travel.pedestrian.inducedTravel.lower +
                        travel.pedestrian.carShift.lower +
                        travel.pedestrian.otherShift.lower);

  let ped_mean_val = (travel.pedestrian.inducedTravel.mean +
                        travel.pedestrian.carShift.mean +
                        travel.pedestrian.otherShift.mean);

  let ped_upper_val = (travel.pedestrian.inducedTravel.upper +
                        travel.pedestrian.carShift.upper +
                        travel.pedestrian.otherShift.upper);

  let ped_lower = ((ped_lower_val * 365) / WALK_SPEED.lower) * WALK_MMET.lower;
  let ped_mean = ((ped_mean_val * 365) / WALK_SPEED.mean) * WALK_MMET.mean;
  let ped_upper = ((ped_upper_val * 365) / WALK_SPEED.upper) * WALK_MMET.upper;

  benefits.pedestrian.lower = calcDiscount(ped_lower, time_frame);
  benefits.pedestrian.mean = calcDiscount(ped_mean, time_frame);
  benefits.pedestrian.upper = calcDiscount(ped_upper, time_frame);

  benefits.total.lower += benefits.pedestrian.lower;
  benefits.total.mean += benefits.pedestrian.mean;
  benefits.total.upper += benefits.pedestrian.upper;

  benefits.bike = {};

  let bike_lower_val = (travel.bike.inducedTravel.lower +
                        travel.bike.carShift.lower +
                        travel.bike.otherShift.lower);

  let bike_mean_val = (travel.bike.inducedTravel.mean +
                        travel.bike.carShift.mean +
                        travel.bike.otherShift.mean);

  let bike_upper_val = (travel.bike.inducedTravel.upper +
                        travel.bike.carShift.upper +
                        travel.bike.otherShift.upper);

  let bike_lower = ((bike_lower_val * 365) / BIKE_SPEED.lower) * BIKE_MMET.lower;
  let bike_mean = ((bike_mean_val * 365) / BIKE_SPEED.mean) * BIKE_MMET.mean;
  let bike_uppper = ((bike_upper_val * 365) / BIKE_SPEED.upper) * BIKE_MMET.upper;

  benefits.bike.lower = calcDiscount(bike_lower, time_frame);
  benefits.bike.mean = calcDiscount(bike_mean, time_frame);
  benefits.bike.upper = calcDiscount(bike_uppper, time_frame);

  benefits.total.lower += benefits.bike.lower;
  benefits.total.mean += benefits.bike.mean;
  benefits.total.upper += benefits.bike.upper;

  return benefits;

}

function calcHealth(travel, time_frame) {

  return {
    'miles': _calc(travel.miles, time_frame),
    'capita': _calc(travel.capita, time_frame),
    'jobs': _calc(travel.jobs, time_frame),
  }

}

export default calcHealth;
