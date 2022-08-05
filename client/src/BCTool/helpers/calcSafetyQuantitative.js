import { SCALING_FACTORS } from './constants';
import calcDiscount from './calcDiscount';

import { USER_INPUT } from './test_data';

const alpha_lookup = require('../data/alpha_lookup.json');
const quantitative = require('../data/quantitative.json');

// p power representing the safety in numbers effect (0.5)
const POWER_SAFETY_IN_NUMBERS = 0.5;

function _calc(infrastructure, travel, length, intersections, subtype,
  time_frame, selectedInfrastructure) {

  let benefits = {
    "bike": {
      "crashes": [],
      "crime": [],
      "deaths": [],
      "injuries": [],
      "speed": [],
      "yielding": [],
    },
    "pedestrian": {
      "crashes": [],
      "crime": [],
      "deaths": [],
      "injuries": [],
      "speed": [],
      "yielding": [],
    },
    "combined": {
      "crashes": [],
      "crime": [],
      "deaths": [],
      "injuries": [],
      "speed": [],
      "yielding": [],
    },
  };

  // Generate a list of benefits based
  // on which infrastructure elements are selected
  //
  // Element benefits can apply to different categories:
  // benefit applies to bike, adds to bike and combined categories
  // benefit applies to ped, adds to ped and combined categories
  // benefit applies to all, adds to combined category only
  //
  // Elements can have benefits for one/several parameters
  // e.g. crashes, crime, deaths, etc.
  //
  // For each selected element add a benefit for each type of
  // improvement (new/upgrade/retrofit) and scale the benefit accordingly
  // Also scale each benefit based on the element's share of the project

  // go through each category
  for(let category of infrastructure.categories) {

    // go through each item
    for(let item of category.items) {

      // if selected and has benefits
      if(item.shortname in selectedInfrastructure && item.shortname in quantitative) {

        for(let type in SCALING_FACTORS) {

          let value = selectedInfrastructure[item.shortname][type];

          if(value === 0) {
            continue;
          }

          let benefit = quantitative[item.shortname];
          let share = 0;

          // get share
          if(item.calc_units === 'length') {

            if(item.units === 'count') {
              // In this case we ask them for a count and
              // then apply a preset length per item
              // i.e. lights every 100 feet
              // and then apply that as a portion of the
              // total project length
              // all are assumed to be per 100 feet right now
              // this will probably change at some point.
              share = (value * 100) / length;
            }
            else if(item.units === 'length') {
              share = value / length;
            }
          }
          else if(item.calc_units === 'count') {
            share = value / intersections;
          }

          share *= SCALING_FACTORS[type];

          // for each effect
          // bike append to bike and combined percent + share
          // ped append to ped and combined percent + share
          // all append to combined percent + share
          for(let effect of benefit) {

            if(effect.mode === 'bike') {
              benefits.bike[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });

              benefits.combined[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });
            }
            else if(effect.mode === 'pedestrian') {
              benefits.pedestrian[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });

              benefits.combined[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });
            }
            else if(effect.mode === 'all') {
              benefits.combined[effect.parameter].push({
                'lower': effect.lower,
                'mean': effect.mean,
                'upper': effect.upper,
                'share': share,
              });
            }
            // else {
            //   console.log(`Unknown effect mode: ${effect.mode}!`);
            // }
          }
        }
      }
    }
  }

  // console.log(benefits);

  let calculatedBenefits = {};

  // Combine lsit of benefits for all elements to a total
  // benefit for each category and parameter
  for(let category of ['bike', 'pedestrian', 'combined']) {

    calculatedBenefits[category] = {};

    for(let parameter in benefits[category]) {

      // if length
      if(benefits[category][parameter].length) {

        // console.log(`${category} ${parameter} has some!`);

        calculatedBenefits[category][parameter] = {
          'lower': 1,
          'mean': 1,
          'upper': 1,
        };

        // multiply all effects (percent * share) together for lower/mean/upper
        for(let benefit of benefits[category][parameter]) {

          // console.log(benefit);

          // calculatedBenefits[category]
          calculatedBenefits[category][parameter].lower *= 1 + ((benefit.lower / 100) * benefit.share);
          calculatedBenefits[category][parameter].mean *= 1 + ((benefit.mean / 100) * benefit.share);
          calculatedBenefits[category][parameter].upper *= 1 + ((benefit.upper / 100) * benefit.share);
        }

      }
      else {

        calculatedBenefits[category][parameter] = {};

        calculatedBenefits[category][parameter].lower = null;
        calculatedBenefits[category][parameter].mean = null;
        calculatedBenefits[category][parameter].upper = null;
      }
    }
  }

  // console.log('-------------------------------')
  // console.log(calculatedBenefits);

  // Calculate the yearly benefit by multiplying the appropriate daily demand
  // in miles by the benefit and then by 365
  for(let category of ['bike', 'pedestrian', 'combined']) {

    let modeProjectedTravel;

    // multiply by appropriate distance
    // bike: travel.bike.projected
    // ped: travel.pedestrian.projected
    // combined: travel.totalProjected
    if(category === 'bike') {
      modeProjectedTravel = travel.bike.projected;
    }
    else if(category === 'pedestrian') {
      modeProjectedTravel = travel.pedestrian.projected;
    }
    else if(category === 'combined') {
      modeProjectedTravel = travel.totalProjected;
    }

    for(let parameter in calculatedBenefits[category]) {

      for(let range of ['lower', 'mean', 'upper']) {

        // multiply by time frame (1yr -> 365 days, miles are per day)
        if(calculatedBenefits[category][parameter][range] !== null) {
          calculatedBenefits[category][parameter][range] *= modeProjectedTravel[range] * 365;
        }
      }
    }
  }

  // console.log('RESULT');
  // console.log(calculatedBenefits);

  // Calculate benefits over project time frame
  let adjustedBenefits = {};

  for(let category of ['bike', 'pedestrian', 'combined']) {

    adjustedBenefits[category] = {};

    for(let parameter in benefits[category]) {

      adjustedBenefits[category][parameter] = {};

      for(let range of ['lower', 'mean', 'upper']) {

        adjustedBenefits[category][parameter][range] = calculatedBenefits[category][parameter][range] !== null ?
          calcDiscount(calculatedBenefits[category][parameter][range], time_frame) : null;
      }
    }
  }

  return adjustedBenefits;
}

  // need crash change per mode (m) and outcome (o)
  // mode = bike / walk
  // outcome = crash / injury / death

  // for each mode and outcome we need to combine location types (j)
  // location types = intersections / roadways

  // the calculation will be new crashes for that m,o,j minus existing crashes for that m,o,j
  // crash change = new crashes - existing crashes

  // new crashes for a given m,o,j will be calculated by

  // NCmoj
  // total = 0
  // for each intersection/roadway (j determines which to consider) in project scope
  //    lookup alpha value based on
  //      functional class (f) (major/minor/local, from network properties)
  //      mode (m) (bike/walk)
  //      outcome (o) (crash/injury/death)
  //      location type (j) (intersection/roadway)
  //      volume index (v) (low/med/high, from network properties)
  //
  //    for each selected infrastructure element that has an entry for this m,o,j
  //      mode (m) (bike/walk)
  //      outcome (o) (crash/injury/death)
  //      location type (j) (intersection/roadway)
  //
  //      CRF crash reduction factor (given as %) / 100
  //
  //      N / L = project share = length/count of element / length/count of project
  //
  //      I = improvement type (1 for new/upgrade, 0.1 for retrofit/maint)
  //
  //      V = volume active travel (to be calculated in previous benefits section) based on
  //        mode (m)
  //        location type (j)
  //
  //      p given as constant 0.5
  //
  //      total += e^alpha * (V + V * E * (N / L) * I)^p * CRF

  // ECmoj
  // existing crashes for a given m,o,j will be calculated by
  // UImojy = user years input for given moj (mode/outcome/location)
  // UImoj = user input for moj (mode/outcome/location)
  //
  // if UImojy >= 5, ECmoj = UImoj/UIy
  // else if 5 > UImojy > 0, ECmoj = (UImoj/UIy) * (UIy / 5) + (1 - (UIy/5)) * CCmojvf (below)
  // else if UImojy = 0 || NA, ECmoj = CCmojvf (below)

  // CCmojvf
  // total = 0
  // for each intersection/roadway (j determines which to consider) in project scope
  //    lookup alpha value based on
  //      functional class (f) (major/minor/local, from network properties)
  //      mode (m) (bike/walk)
  //      outcome (o) (crash/injury/death)
  //      location type (j) (intersection/roadway)
  //      volume index (v) (low/med/high, from network properties)
  //
  //    lookup volume active travel (to be calculated in previous benefits section) based on
  //      mode (m)
  //      location type (j)
  //
  //    p given as constant 0.5

  //    total += (e^alpha) * (volume active travel^p)

  // OVERALL
  // for [pedestrian, bicycling]
  //  for [crashes, injuries, deaths]
  //     calculate new crashes NC for intersections
  //     calculate existing crashes EC for intersections
  //
  //     calculate new crashes NC for roadways
  //     calculate existing crashes EC for roadways
  //
  //     calculate crash change (CC) for intersections (NC - EC)
  //     calculate crash change (CC) for roadways (NC - EC)
  //
  //     calculate total crash change as CC intersections + CC roadways
  //
  //     calculate before crash outcomes for intersections as  EC intersections / V intersections
  //     calculate before crash outcomes for roadways as EC roadways / V roadways
  //     before crash outcomes per 1000 volumes = before crash outcomes for intersections + before crash outcomes for roadways * 1000
  //
  //     calculate after crash outcomes for intersections as  NC intersections / V intersections
  //     calculate after crash outcomes for roadways as NC roadways / V roadways
  //     after crash outcomes per 1000 volumes = after crash outcomes for intersections + after crash outcomes for roadways * 1000


  // benefit table (output)
  // 1st col: bike/pedestrian/combined (3)
  // 2nd col: crashes/injuries/deaths rows for each first column (9)
  // 3rd col: crash change for this m/o, before crash outcomes per 1000 volume for this m/o, after crash outcomes per 1000 volume for this m/o rows for each outcome in second column (27)
  // 4th col: same as 3rd but per capita (27)
  // 5th col: same as 3rd but per jobs (27)

const _newCalc = () => {

  const modes = ['bicycling', 'walking'];
  const outcomes = ['crash', 'injury', 'death'];
  const location_types = ['intersection', 'roadway'];

  // where do we take volume active travel from here?!
  let Vmj = {};

  for(let mode of modes) {
    Vmj[mode] = {};
    for(let location_type of location_types) {
      Vmj[mode][location_type] = 12345;
    }
  }

  // calculate crash change by mode and outcome
  // calculate new crashes by mode, outcome, and location type
  // calculate existing crashes by mode, outcome, and location type
  const change = {};
  const NCmoj = {};
  const ECmoj = {};

  for(let mode of modes) {

    change[mode] = {};
    NCmoj[mode] = {};
    ECmoj[mode] = {};

    for(let outcome of outcomes) {

      change[mode][outcome] = 0;
      NCmoj[mode][outcome] = {};
      ECmoj[mode][outcome] = {};

      for(let location_type of location_types) {

        let NC = _NCmoj(mode, outcome, location_type);
        let EC = _ECmoj(mode, outcome, location_type);

        NCmoj[mode][outcome][location_type] = NC;
        ECmoj[mode][outcome][location_type] = EC;
        change[mode][outcome] += NC - EC;
      }
    }
  }

  // calc crash change combined walking/bicycling
  change.combined = {};

  for(let outcome of outcomes) {
    change.combined[outcome] = 0;
  }

  for(let mode of modes) {
    for(let outcome of outcomes) {
      change.combined[outcome] += change[mode][outcome];
    }
  }

  // calc before crash outcomes per 1000 volume by mode and outcome
  // calc after crash outcomes per 1000 volume by mode and outcome
  let before = {};
  let after = {};

  for(let mode of modes) {

    before[mode] = {};
    after[mode] = {};

    for(let outcome of outcomes) {

      before[mode][outcome] = 0;
      after[mode][outcome] = 0;

      for(let location_type of location_types) {
        before[mode][outcome] += (
          ECmoj[mode][outcome][location_type] / Vmj[mode][location_type]);

        after[mode][outcome] += (
          NCmoj[mode][outcome][location_type] / Vmj[mode][location_type]);
      }
    }
  }

  for(let mode of modes) {
    for(let outcome of outcomes) {
      before[mode][outcome] *= 1000;
      after[mode][outcome] *= 1000;
    }
  }

  before.combined = {}
  after.combined = {}

  for(let outcome of outcomes) {
    before.combined[outcome] = 0;
    after.combined[outcome] = 0;
  }

  for(let mode of modes) {
    for(let outcome of outcomes) {
      before.combined[outcome] += before[mode][outcome];
      after.combined[outcome] += after[mode][outcome];
    }
  }

  return {
    change: change,
    before: before,
    after: after,
  };

};

// CRASHES BY SYSTEM CLASS
// INPUTS:
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
// v volume index (low/medium/high)
// f functional class index (major/minor/local)
// V volume of active travel
const _CCmojvf = (mode, outcome, location_type, volume, functional_class, volume_active_travel) => {

  let alpha = alpha_lookup[location_type][mode][volume][functional_class][outcome];

  return Math.exp(alpha) * Math.pow(volume_active_travel, POWER_SAFETY_IN_NUMBERS);
};

// CRASHES BY SYSTEM CLASS
// INPUTS:
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const _ECmoj_model_only = (m, o, j) => {

  // calc over relevant project scope (f/v)
  // i think this boils down to looping over all the selected
  // intersections and roadways in the project and
  // calling __CCmojvf for each one and passing in the relevant f and v
  // from the properties

};

const _ECmoj_split = (m, o, j) => {

  let UImoj = user_input[m][j][o];
  let UIy = user_input[m][j].years;

  // calc over relevant project scope (f/v)
  // ((UImoj / UIy) * (UIy / 5)) +
  // ((1 - (UIy / 5)) * _CCmoj(m, o, j))

}

// EXISTING CRASHES
// INPUTS:
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const _ECmoj = (m, o, j) => {

  // User input number of years of data for this m, j
  let UIy = user_input[m][j].years;

  // not null and greater than 0
  if(UIy && UIy > 0) {

    // 5 or more years, use user input directly
    if(UIy >= 5) {
      return user_input[m][j][o];
    }
    // more than 0 but less than 5, split between
    // model and user input
    else {
      return _ECmoj_split(m, o, j);
    }
  }
  // 0 or null, use model only
  else {
    return _ECmoj_model_only(m, o, j);
  }
};

// NEW CRASHES
// INPUTS:
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const _NCmoj = (m, o, j) => {

  // calc over relevant project scope (f/v)

};

// NEW CRASHES
// INPUTS:
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
// v volume index (low/medium/high)
// f functional class index (major/minor/local)
// V volume of active travel
// E
// N
// L
// I
// CRF
const _NC = (m, o, j, v, f, V, E, N, L, I, CRF) => {

  let alpha = alpha_lookup[j][m][v][f][o];
  let volume_increase = V * E * (N / L) * I;
  let new_volume = V + volume_increase;

  return Math.exp(alpha) * Math.pow(new_volume, POWER_SAFETY_IN_NUMBERS) * CRF;
};

function calcSafetyQuantitative(infrastructure, travel, length, intersections, subtype, time_frame, selectedInfrastructure) {

  _newCalc(); // repeated for miles/capita/jobs

  return {
    "miles": _calc(infrastructure, travel.miles, length, intersections, subtype, time_frame, selectedInfrastructure),
    "capita": _calc(infrastructure, travel.capita, length, intersections, subtype, time_frame, selectedInfrastructure),
    "jobs": _calc(infrastructure, travel.jobs, length, intersections, subtype, time_frame, selectedInfrastructure),
  }

}

export default calcSafetyQuantitative;

