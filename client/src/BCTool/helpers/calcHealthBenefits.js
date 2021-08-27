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

  let benefits = [];

  benefits.push({
      'type': 'Pedestrian',
      'lower': (totals['pedestrian']['lower'] / WALK_SPEED['lower']) * WALK_MMET['lower'],
      'mean': (totals['pedestrian']['mean'] / WALK_SPEED['mean']) * WALK_MMET['mean'],
      'upper': (totals['pedestrian']['upper'] / WALK_SPEED['upper']) * WALK_MMET['upper'],
  })

  if(subtype !== 'pedestrian-only') {
    benefits.push({
      'type': 'Bike',
      'lower': (totals['bike']['lower'] / BIKE_SPEED['lower']) * BIKE_MMET['lower'],
      'mean': (totals['bike']['mean'] / BIKE_SPEED['mean']) * BIKE_MMET['mean'],
      'upper': (totals['bike']['upper'] / BIKE_SPEED['upper']) * BIKE_MMET['upper'],
    });
  }

  return benefits;

}

export default calcHealthBenefits;
