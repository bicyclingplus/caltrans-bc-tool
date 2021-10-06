const BIKE_FACTOR = 0.506;

function calcVMTReductions(travel) {

  if('bike' in travel) {
    return {
      'lower': travel.bike.carShift.lower * BIKE_FACTOR * 365,
      'mean': travel.bike.carShift.mean * BIKE_FACTOR * 365,
      'upper': travel.bike.carShift.upper * BIKE_FACTOR * 365,
    }
  }

  return {
    'lower': 0,
    'mean': 0,
    'upper': 0,
  };
}

export default calcVMTReductions;
