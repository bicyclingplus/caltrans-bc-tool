const WALK_FACTOR = 0.646;
const BIKE_FACTOR = 0.506;

function _calcVMTReduction(demand, type, factor) {
  let benefits = {};

  benefits['lower'] = demand[type]['lower'] * factor * 365;
  benefits['mean'] = demand[type]['mean'] * factor * 365;
  benefits['upper'] = demand[type]['upper'] * factor * 365;

  return benefits;
}

function calcVMTReductions(subtype, demand) {

  let benefits = {};

  if(subtype !== 'pedestrian-only') {
    benefits['bike'] = _calcVMTReduction(demand, 'bike', BIKE_FACTOR);
  }

  benefits['pedestrian'] = _calcVMTReduction(demand, 'pedestrian', WALK_FACTOR);

  return benefits;
}

export default calcVMTReductions;
