const BIKE_FACTOR = 0.506;

function _calc(travel) {
  return {
    'lower': travel.carShift.lower * BIKE_FACTOR * 365,
    'mean': travel.carShift.mean * BIKE_FACTOR * 365,
    'upper': travel.carShift.upper * BIKE_FACTOR * 365,
  }
}

function calcVMTReductions(travel) {

  return {
    'miles': _calc(travel.miles.bike),
    'capita': _calc(travel.capita.bike),
    'jobs': _calc(travel.jobs.bike),
  }
}

export default calcVMTReductions;
