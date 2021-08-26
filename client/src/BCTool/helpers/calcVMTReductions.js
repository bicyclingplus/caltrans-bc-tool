import { NICE_NAMES } from './formatting';

const WALK_FACTOR = 0.646;
const BIKE_FACTOR = 0.506;

function _calcVMTReduction(demand, type, factor) {
  let benefits = {};

  benefits['lower'] = demand[type]['lower'] * factor * 365;
  benefits['mean'] = demand[type]['mean'] * factor * 365;
  benefits['upper'] = demand[type]['upper'] * factor * 365;
  benefits['shorttype'] = type;

  return benefits;
}

function calcVMTReductions(subtype, demand) {

  let benefits = [];

  let pedestrian = _calcVMTReduction(demand, 'pedestrian', WALK_FACTOR);
  pedestrian['type'] = NICE_NAMES[pedestrian['shorttype']];
  benefits.push(pedestrian);

  if(subtype !== 'pedestrian-only') {
    let bike = _calcVMTReduction(demand, 'bike', BIKE_FACTOR);
    bike['type'] = NICE_NAMES[bike['shorttype']];
    benefits.push(bike);
  }

  return benefits;
}

export default calcVMTReductions;
