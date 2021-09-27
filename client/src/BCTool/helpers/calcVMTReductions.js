const BIKE_FACTOR = 0.506;

function calcVMTReductions(demand) {

  if('bike' in demand) {
    return {
      'lower': demand.bike.carShift.lower * BIKE_FACTOR * 365,
      'mean': demand.bike.carShift.mean * BIKE_FACTOR * 365,
      'upper': demand.bike.carShift.upper * BIKE_FACTOR * 365,
    }
  }

  return {
    'lower': 0,
    'mean': 0,
    'upper': 0,
  };
}

export default calcVMTReductions;
