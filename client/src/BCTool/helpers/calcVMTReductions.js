import calcDiscount from './calcDiscount';

const BIKE_FACTOR = 0.506;

function _calc(travel, time_frame) {

  // 1 yr calculations
  let lower = travel.carShift.lower * BIKE_FACTOR * 365;
  let mean = travel.carShift.mean * BIKE_FACTOR * 365;
  let upper = travel.carShift.upper * BIKE_FACTOR * 365;

  return {
    'lower': calcDiscount(lower, time_frame),
    'mean': calcDiscount(mean, time_frame),
    'upper': calcDiscount(upper, time_frame),
  };
}

function calcVMTReductions(travel, time_frame) {

  return {
    'miles': _calc(travel.miles.bike, time_frame),
    'capita': _calc(travel.capita.bike, time_frame),
    'jobs': _calc(travel.jobs.bike, time_frame),
  };
}

export default calcVMTReductions;
