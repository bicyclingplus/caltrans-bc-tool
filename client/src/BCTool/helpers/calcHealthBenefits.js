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

function calcHealthBenefits(subtype, demandIncreases) {

  let totals = {
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

  if(! demandIncreases.length) {
    return [];
  }

  // Add up all the demand increases by type
  for(const row of demandIncreases) {
    totals[row['shorttype']]['lower'] += row['lower'];
    totals[row['shorttype']]['mean'] += row['mean'];
    totals[row['shorttype']]['upper'] += row['upper'];
  }

  // Calculate health benefits
  // (demand increase in miles / speed in mph)
  //    * Marginal Metabolic Equivalent of Task (MMET) per hour
  // yields MMET

  totals['pedestrian']['lower'] = (totals['pedestrian']['lower'] / WALK_SPEED['lower']) * WALK_MMET['lower'];
  totals['pedestrian']['mean'] = (totals['pedestrian']['mean'] / WALK_SPEED['mean']) * WALK_MMET['mean'];
  totals['pedestrian']['upper'] = (totals['pedestrian']['upper'] / WALK_SPEED['upper']) * WALK_MMET['upper'];

  totals['bike']['lower'] = (totals['bike']['lower'] / BIKE_SPEED['lower']) * BIKE_MMET['lower'];
  totals['bike']['mean'] = (totals['bike']['mean'] / BIKE_SPEED['mean']) * BIKE_MMET['mean'];
  totals['bike']['upper'] = (totals['bike']['upper'] / BIKE_SPEED['upper']) * BIKE_MMET['upper'];

  totals['total']['lower'] = totals['pedestrian']['lower'] + totals['bike']['lower'];
  totals['total']['mean'] = totals['pedestrian']['mean'] + totals['bike']['mean'];
  totals['total']['upper'] = totals['pedestrian']['upper'] + totals['bike']['upper'];

  return totals;

}

export default calcHealthBenefits;
