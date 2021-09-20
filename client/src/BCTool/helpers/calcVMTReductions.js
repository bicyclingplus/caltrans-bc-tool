import { NICE_NAMES } from './formatting';

const WALK_FACTOR = 0.646;
const BIKE_FACTOR = 0.506;

function _calcVMTReduction(demand, type, factor) {
  return {
    'lower': demand[type]['lower'] * factor * 365,
    'mean': demand[type]['mean'] * factor * 365,
    'upper': demand[type]['upper'] * factor * 365,
  };
}

function calcVMTReductions(subtype, demand) {

  let totals = {
    'lower': 0,
    'mean': 0,
    'upper': 0,
  };

  // let pedestrian = _calcVMTReduction(demand, 'pedestrian', WALK_FACTOR);

  // totals['lower'] += pedestrian['lower'];
  // totals['mean'] += pedestrian['mean'];
  // totals['upper'] += pedestrian['upper'];

  let bike = _calcVMTReduction(demand, 'bike', BIKE_FACTOR);

  totals['lower'] += bike['lower'];
  totals['mean'] += bike['mean'];
  totals['upper'] += bike['upper'];

  return {
    'bike': bike,
    // 'pedestrian': pedestrian,
    'total': totals,
  };
}

export default calcVMTReductions;
