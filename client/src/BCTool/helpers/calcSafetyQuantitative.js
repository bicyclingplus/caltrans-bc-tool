import {
  SCALING_FACTORS,
  ESTIMATES,
} from './constants';
import calcDiscount from './calcDiscount';

import { USER_INPUT } from './test_data';

const alpha_lookup = require('../data/alpha_lookup.json');
const quantitative = require('../data/quantitative.json');
const travel_volume = require('../data/travel_volume.json');

// p power representing the safety in numbers effect (0.5)
const POWER_SAFETY_IN_NUMBERS = 0.5;
const FUNCTIONAL_CLASSES = ['major_road', 'minor_road', 'local'];
const COLUMNS = ['safety', 'capita', 'jobs'];
const MODES = ['bicycling', 'walking'];
const LOCATION_TYPES = ['intersection', 'roadway'];
const VOLUMES = ['low', 'medium', 'high'];
const OUTCOMES = ['crash', 'injury', 'death'];

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

const _newCalc = (Vmj_existing, Vmj_projected) => {

  const internalCalc = () => {

    // calculate crash change by mode and outcome
    // calculate new crashes by mode, outcome, and location type
    // calculate existing crashes by mode, outcome, and location type
    const change = {};
    const NCmoj = {};
    const ECmoj = {};

    for(let mode of MODES) {

      change[mode] = {};
      NCmoj[mode] = {};
      ECmoj[mode] = {};

      for(let outcome of OUTCOMES) {

        change[mode][outcome] = 0;
        NCmoj[mode][outcome] = {};
        ECmoj[mode][outcome] = {};

        for(let location_type of LOCATION_TYPES) {

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

    for(let outcome of OUTCOMES) {
      change.combined[outcome] = 0;
    }

    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        change.combined[outcome] += change[mode][outcome];
      }
    }

    // calc before crash outcomes per 1000 volume by mode and outcome
    // calc after crash outcomes per 1000 volume by mode and outcome
    let before = {};
    let after = {};

    for(let mode of MODES) {

      before[mode] = {};
      after[mode] = {};

      for(let outcome of OUTCOMES) {

        before[mode][outcome] = 0;
        after[mode][outcome] = 0;

        for(let location_type of LOCATION_TYPES) {

          // existing travel lookup for Vmj
          before[mode][outcome] += (
            ECmoj[mode][outcome][location_type] / Vmj_existing[mode][location_type]);

          // projected travel lookup for Vmj
          after[mode][outcome] += (
            NCmoj[mode][outcome][location_type] / Vmj_projected[mode][location_type]);
        }
      }
    }

    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        before[mode][outcome] *= 1000;
        after[mode][outcome] *= 1000;
      }
    }

    before.combined = {}
    after.combined = {}

    for(let outcome of OUTCOMES) {
      before.combined[outcome] = 0;
      after.combined[outcome] = 0;
    }

    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        before.combined[outcome] += before[mode][outcome];
        after.combined[outcome] += after[mode][outcome];
      }
    }

    console.log(ECmoj);
    console.log(NCmoj);

    return {
      change: change,
      before: before,
      after: after,
    };
  };

  // EXISTING CRASHES
  // INPUTS:
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _ECmoj = (m, o, j) => {

    // User input number of years of data for this m, j
    let UIy = USER_INPUT[m].years[j];

    // not null and greater than 0
    if(UIy && UIy > 0) {

      // 5 or more years, use user input directly
      if(UIy >= 5) {
        return USER_INPUT[m][o][j];
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

  // EXISTING CRASHES SPLIT
  // Part user input and part model
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _ECmoj_split = (m, o, j) => {

    const UImoj = USER_INPUT[m][o][j];
    const UIy = USER_INPUT[m].years[j];

    let total = 0;

    for(let functional_class of FUNCTIONAL_CLASSES) {
      for(let volume of VOLUMES) {

        total += ((UImoj / UIy) * (UIy / 5)) +
          ((1 - (UIy / 5)) * _CCmojvf(m, o, j, volume, functional_class));
      }
    }

    return total;
  }

  // EXISTING CRASHES MODEL ONLY
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _ECmoj_model_only = (m, o, j) => {

    let total = 0;

    for(let functional_class of FUNCTIONAL_CLASSES) {
      for(let volume of VOLUMES) {

        total += _CCmojvf(m, o, j, volume, functional_class);
      }
    }

    return total;

  };

  // CRASHES BY SYSTEM CLASS
  // INPUTS:
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  // v volume index (low/medium/high)
  // f functional class index (major/minor/local)
  const _CCmojvf = (m, o, j, v, f) => {

    const alpha = alpha_lookup[m][o][j][v][f];
    const Lvf = 1; // move to lookup (count/length)
    const Vmj = Vmj_existing[m][j]; // move to lookup (existing travel)

    return Math.exp(alpha) * Lvf * Math.pow(Vmj, POWER_SAFETY_IN_NUMBERS);
  };

  // NEW CRASHES
  // INPUTS:
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _NCmoj = (m, o, j) => {

    let total = 0;

    for(let functional_class of FUNCTIONAL_CLASSES) {
      for(let volume of VOLUMES) {

        let alpha = alpha_lookup[m][o][j][volume][functional_class];
        let Lvf = 1; // move to lookup (count/length)
        let Vmj = Vmj_projected[m][j]; // move to lookup (projected travel)

        // loop over selected elements?
        // pre calc CRFmoji for selected infrastructure elements?
        // TODO !!!!!!!!!!!!!!!!!
        let CRFmoji = 1 // move to lookup

        total += (
          Math.exp(alpha) *
          Lvf *
          Math.pow(Vmj, POWER_SAFETY_IN_NUMBERS) *
          CRFmoji
        );
      }
    }

    return total;
  };

  return internalCalc();
};

const avgProp = (items, property) => {

  // console.log(`Averaging ${property}`);

  let total = 0;
  let count = 0;

  for(let item of items) {

    // console.log(item.properties[property]);

    if(item.properties[property]) {
      total+= item.properties[property];
      count++;
    }
  }

  if(count > 0) {
    return total / count;
  }

  return null;
};

const calcSafetyQuantitativeNew = (
  selectedWays,
  selectedIntersections,
  infrastructure,
  selectedInfrastructure,
  project_length,
  num_intersections) => {

  // _newCalc(); // repeat for miles/capita/jobs like the old version

  // need a lookup for existing volume by mode and location type
  let Vmj_existing = {};
  // let Lvf = {};

  for(let column of COLUMNS) {
    Vmj_existing[column] = {};

    for(let mode of MODES) {
      Vmj_existing[column][mode] = {};

      for(let location_type of LOCATION_TYPES) {
        Vmj_existing[column][mode][location_type] = 0;
      }
    }
  }

  // need a lookup for length/count by volume and functional class
  // for(let volume of volumes) {
  //   Lvf[volume] = {};

  //   for(let functional_class of FUNCTIONAL_CLASSES) {
  //     Lvf[volume][functional_class] = 0;
  //   }
  // }

  // for each selected way, user way, selected intersection, user intersection
  // add appropriate properties to corresponding Vmj_existing
  // add length / increment count for Lvf

  let avgWayBikeExp = avgProp(selectedWays, 'bicyclist_link_exposure');
  let avgWayPedExp = avgProp(selectedWays, 'pedestrian_link_exposure');
  let avgWayPop = avgProp(selectedWays, 'population');
  let avgWayJobs = avgProp(selectedWays, 'jobs');

  // console.log(`avgWayBikeExp ${avgWayBikeExp}`);
  // console.log(`avgWayPedExp ${avgWayPedExp}`);
  // console.log(`avgWayPop ${avgWayPop}`);
  // console.log(`avgWayJobs ${avgWayJobs}`);

  for(let way of selectedWays) {

    let population = way.properties.population || avgWayPop;
    let jobs = way.properties.jobs || avgWayJobs;

    let bikeExp = way.properties.bicyclist_link_exposure || avgWayBikeExp;
    let pedExp = way.properties.pedestrian_link_exposure || avgWayPedExp;

    if(bikeExp) {
      Vmj_existing.safety.bicycling.roadway += bikeExp;
      Vmj_existing.capita.bicycling.roadway += bikeExp / population;
      Vmj_existing.jobs.bicycling.roadway += bikeExp / jobs;
    }

    if(pedExp) {
      Vmj_existing.safety.walking.roadway += pedExp;
      Vmj_existing.capita.walking.roadway += pedExp / population;
      Vmj_existing.jobs.walking.roadway += pedExp / jobs;
    }

    // ?????????????????????????????????????????
    // let functional_class = way.properties.functional;
    // let volume_bike = way.properties.bicycle_exposure_class;
    // let volume_ped = way.properties.pedestrian_link_exposure_class;
    // let length = way.properties.length;

    // console.log(`functional_class ${functional_class}`);
    // console.log(`volume_bike ${volume_bike}`);
    // console.log(`volume_ped ${volume_ped}`);

    // if(volume_bike) {
    //   Lvf[volume_bike.toLowerCase()][functional_class] += length;
    // }

    // if(volume_ped) {
    //   Lvf[volume_ped.toLowerCase()][functional_class] += length;
    // }
  }

  let avgIntBikeExp = avgProp(selectedIntersections, 'bicycle_node_exposure');
  let avgIntPedExp = avgProp(selectedIntersections, 'pedestrian_node_exposure');
  let avgIntPop = avgProp(selectedIntersections, 'population');
  let avgIntJobs = avgProp(selectedIntersections, 'jobs');

  // console.log(`avgIntBikeExp ${avgIntBikeExp}`);
  // console.log(`avgIntPedExp ${avgIntPedExp}`);
  // console.log(`avgIntPop ${avgIntPop}`);
  // console.log(`avgIntJobs ${avgIntJobs}`);

  for(let intersection of selectedIntersections) {

    let population = intersection.properties.population || avgIntPop;
    let jobs = intersection.properties.jobs || avgIntJobs;

    let bikeExp = intersection.properties.bicycle_node_exposure || avgIntBikeExp;
    let pedExp = intersection.properties.pedestrian_node_exposure || avgIntPedExp;

    if(bikeExp) {
      Vmj_existing.safety.bicycling.intersection += bikeExp;
      Vmj_existing.capita.bicycling.intersection += bikeExp / population;
      Vmj_existing.jobs.bicycling.intersection += bikeExp / jobs;
    }

    if(pedExp) {
      Vmj_existing.safety.walking.intersection += pedExp;
      Vmj_existing.capita.walking.intersection += pedExp / population;
      Vmj_existing.jobs.walking.intersection += pedExp / jobs;
    }

    // ?????????????????????????????????????????
    // let functional_class = intersection.properties.functional;
    // let volume_bike = intersection.properties.bicycle_exposure_class;
    // let volume_ped = intersection.properties.pedestrian_exposure_class;

    // console.log(`functional_class ${functional_class}`);
    // console.log(`volume_bike ${volume_bike}`);
    // console.log(`volume_ped ${volume_ped}`);

    // if(volume_bike) {
    //   Lvf[volume_bike.toLowerCase()][functional_class]++;
    // }

    // if(volume_ped) {
    //   Lvf[volume_ped.toLowerCase()][functional_class]++;
    // }
  }

  // console.log(Lvf);

  // need a lookup for projected volume by mode and location type
  let Vmj_projected = structuredClone(Vmj_existing);

  for(let category of infrastructure.categories) {

        for(let item of category.items) {

            // the element is selected
            // the element has benefits
            // the element has benefits for this mode
            if(item.shortname in selectedInfrastructure &&
                item.shortname in travel_volume) {

                for(let mode of MODES) {
                  if(mode in travel_volume[item.shortname]) {
                    let benefit = travel_volume[item.shortname][mode];

                    // calculate the increase for each improvement
                    // type for this element
                    for(let type in SCALING_FACTORS) {

                      let value = selectedInfrastructure[item.shortname][type];

                      if(value === 0) {
                          continue;
                      }

                      let share = 0;

                      // calculate the project share for this element
                      if(item.calc_units === 'length') {

                          if(item.units === 'count') {
                              // In this case we ask them for a count and
                              // then apply a preset length per item
                              // i.e. lights every 100 feet
                              // and then apply that as a portion of the
                              // total project length
                              // all are assumed to be per 100 feet right now
                              // this will probably change at some point.
                              share = (value * 100) / project_length;
                          }
                          else if(item.units === 'length') {
                              share = value / project_length;
                          }
                      }
                      else if(item.calc_units === 'count') {
                          share = value / num_intersections;
                      }


                      for(let column of COLUMNS) {

                        for(let location_type of LOCATION_TYPES) {

                          console.log(`Increase to ${mode} due to ${item.shortname} on ${column} and ${location_type}`);
                          console.log(`share ${share}`);
                          console.log(`factor ${SCALING_FACTORS[type]}`);
                          console.log(`benefit ${benefit.mean / 100}`)

                          // TODO add estimates low/mean/high to projected travel

                          Vmj_projected[column][mode][location_type] += (
                              Vmj_existing[column][mode][location_type] *
                              (benefit.mean / 100) *
                              share *
                              SCALING_FACTORS[type]
                          );
                        }
                      }

                    }
                  }
                }
            }
        }
    }

  // for selected elements go through travel volume benefits and apply

  // calc combined for Vmj_existing and Vmj_projected
  for(let column of COLUMNS) {

    Vmj_existing[column].combined = {};
    Vmj_projected[column].combined = {};

    for(let location_type of LOCATION_TYPES) {
      Vmj_existing[column].combined[location_type] = 0;
      Vmj_projected[column].combined[location_type] = 0;
    }

    for(let mode of MODES) {
      for(let location_type of LOCATION_TYPES) {
        Vmj_existing[column].combined[location_type] += Vmj_existing[column][mode][location_type];
        Vmj_projected[column].combined[location_type] += Vmj_projected[column][mode][location_type];
      }
    }
  }

  console.log(Vmj_existing.safety);
  console.log(Vmj_projected.safety);

  let benefits = {};

  for(let column of COLUMNS) {
    benefits[column] = _newCalc(Vmj_existing[column], Vmj_projected[column]);
  }

  console.log(benefits.safety);

  return benefits;
}

const calcSafetyQuantitative = (infrastructure, travel, length, intersections, subtype, time_frame, selectedInfrastructure) => {

  return {
    "miles": _calc(infrastructure, travel.miles, length, intersections, subtype, time_frame, selectedInfrastructure),
    "capita": _calc(infrastructure, travel.capita, length, intersections, subtype, time_frame, selectedInfrastructure),
    "jobs": _calc(infrastructure, travel.jobs, length, intersections, subtype, time_frame, selectedInfrastructure),
  };
}

// export default calcSafetyQuantitative;

export { calcSafetyQuantitative, calcSafetyQuantitativeNew }

