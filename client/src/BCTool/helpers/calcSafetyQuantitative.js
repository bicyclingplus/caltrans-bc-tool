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


const _calc = (Vmj_existing, Vmj_projected, Lmjvf, selectedInfrastructure) => {

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

        change[mode][outcome] = {};
        NCmoj[mode][outcome] = {};
        ECmoj[mode][outcome] = {};

        for(let estimate of ESTIMATES) {
          change[mode][outcome][estimate] = 0;
        }

        for(let location_type of LOCATION_TYPES) {

          let EC = _ECmoj(mode, outcome, location_type);
          ECmoj[mode][outcome][location_type] = EC;


          NCmoj[mode][outcome][location_type] = {};

          // by estimate
          for(let estimate of ESTIMATES) {
            let NC = _NCmoj(mode, outcome, location_type, estimate);
            NCmoj[mode][outcome][location_type][estimate] = NC;

            change[mode][outcome][estimate] += NC - EC;
          }
        }
      }
    }

    // calc crash change combined walking/bicycling
    change.combined = {};

    for(let outcome of OUTCOMES) {

      change.combined[outcome] = {};

      for(let estimate of ESTIMATES) {
        change.combined[outcome][estimate] = 0;
      }
    }

    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        for(let estimate of ESTIMATES) {
          change.combined[outcome][estimate] += change[mode][outcome][estimate];
        }
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
        after[mode][outcome] = {};

        for(let estimate of ESTIMATES) {
          after[mode][outcome][estimate] = 0;
        }

        for(let location_type of LOCATION_TYPES) {

          // existing travel lookup for Vmj
          before[mode][outcome] += (
            ECmoj[mode][outcome][location_type] / Vmj_existing[mode][location_type]);

          for(let estimate of ESTIMATES) {

            // projected travel lookup for Vmj
            after[mode][outcome][estimate] += (
              NCmoj[mode][outcome][location_type][estimate] /
              Vmj_projected[mode][location_type][estimate]
            );
          }
        }
      }
    }

    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        before[mode][outcome] *= 1000;

        for(let estimate of ESTIMATES) {
          after[mode][outcome][estimate] *= 1000;
        }
      }
    }

    before.combined = {}
    after.combined = {}

    for(let outcome of OUTCOMES) {
      before.combined[outcome] = 0;
      after.combined[outcome] = {};

      for(let estimate of ESTIMATES) {
        after.combined[outcome][estimate] = 0;
      }
    }

    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        before.combined[outcome] += before[mode][outcome];

        for(let estimate of ESTIMATES) {
          after.combined[outcome][estimate] += after[mode][outcome][estimate];
        }
      }
    }

    // console.log(ECmoj);
    // console.log(NCmoj);

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
    const _Lmjvf = Lmjvf[m][j][v][f];
    const Vmj = Vmj_existing[m][j];

    return Math.exp(alpha) * _Lmjvf * Math.pow(Vmj, POWER_SAFETY_IN_NUMBERS);
  };

  // NEW CRASHES
  // INPUTS:
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _NCmoj = (m, o, j, estimate) => {

    let total = 0;

    for(let functional_class of FUNCTIONAL_CLASSES) {
      for(let volume of VOLUMES) {

        let alpha = alpha_lookup[m][o][j][volume][functional_class];
        let _Lmjvf = Lmjvf[m][j][volume][functional_class];
        let Vmj = Vmj_projected[m][j][estimate];

        // loop over selected elements?
        // pre calc CRFmoji for selected infrastructure elements?
        // TODO !!!!!!!!!!!!!!!!!
        // let CRFmoji = 1 // move to lookup

        // total += (
        //   Math.exp(alpha) *
        //   _Lmjvf *
        //   Math.pow(Vmj, POWER_SAFETY_IN_NUMBERS) *
        //   CRFmoji
        // );

        // loop over elements that have safety benefits
        for(let element in quantitative) {

          // only consider selected elements
          if(element in selectedInfrastructure) {

            // go through the safety benefits for this element
            for(let benefit of quantitative[element]) {


              // TODO
              // change parameters to match outcomes
              // change modes to match these ones (all to combined also)
              // change class to match j

              // only apply benefits meant for this m/o/j
              if(benefit.mode == m &&
                benefit.paramater == o &&
                benefit.class == j) {

                let CRFmoji = benefit[estimate] / 100;

                total += (
                  Math.exp(alpha) *
                  _Lmjvf *
                  Math.pow(Vmj, POWER_SAFETY_IN_NUMBERS) *
                  CRFmoji
                );

              }
            }
          }
        }
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

const calcSafetyQuantitative = (
  selectedWays,
  selectedIntersections,
  infrastructure,
  selectedInfrastructure,
  project_length,
  num_intersections) => {

  // need a lookup for existing volume by mode and location type
  let Vmj_existing = {};

  for(let column of COLUMNS) {
    Vmj_existing[column] = {};

    for(let mode of MODES) {
      Vmj_existing[column][mode] = {};

      for(let location_type of LOCATION_TYPES) {
        Vmj_existing[column][mode][location_type] = 0;
      }
    }
  }

  // need a lookup for length/count by volume and functional class and location type
  let Lmjvf = {};

  for(let mode of MODES) {

    Lmjvf[mode] = {};

    for(let location_type of LOCATION_TYPES) {

      Lmjvf[mode][location_type] = {};

      for(let volume of VOLUMES) {

        Lmjvf[mode][location_type][volume] = {};

        for(let functional_class of FUNCTIONAL_CLASSES) {
          Lmjvf[mode][location_type][volume][functional_class] = 0;
        }
      }
    }
  }

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

    // populate Lvfj
    let functional_class = way.properties.functional;
    let volume_bike = way.properties.bicycle_exposure_class;
    let volume_ped = way.properties.pedestrian_link_exposure_class;
    let length = way.properties.length;

    // console.log(`functional_class ${functional_class}`);
    // console.log(`volume_bike ${volume_bike}`);
    // console.log(`volume_ped ${volume_ped}`);

    if(volume_bike) {
      Lmjvf.bicycling.roadway[volume_bike.toLowerCase()][functional_class] += length;
    }

    if(volume_ped) {
      Lmjvf.walking.roadway[volume_ped.toLowerCase()][functional_class] += length;
    }
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

    // populate Lvfj
    let functional_class = intersection.properties.functional;
    let volume_bike = intersection.properties.bicycle_exposure_class;
    let volume_ped = intersection.properties.pedestrian_exposure_class;

    // console.log(`functional_class ${functional_class}`);
    // console.log(`volume_bike ${volume_bike}`);
    // console.log(`volume_ped ${volume_ped}`);

    if(volume_bike) {
      Lmjvf.bicycling.intersection[volume_bike.toLowerCase()][functional_class]++;
    }

    if(volume_ped) {
      Lmjvf.walking.intersection[volume_ped.toLowerCase()][functional_class]++;
    }
  }

  // need a lookup for projected volume by mode and location type
  let Vmj_projected = {};

  for(let column of COLUMNS) {
    Vmj_projected[column] = {};

    for(let mode of MODES) {
      Vmj_projected[column][mode] = {};

      for(let location_type of LOCATION_TYPES) {

        Vmj_projected[column][mode][location_type] = {}

        for(let estimate of ESTIMATES) {

          Vmj_projected[column][mode][location_type][estimate] =
            Vmj_existing[column][mode][location_type];

        }
      }
    }
  }

  // for selected elements go through travel volume benefits and apply
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

                  // console.log(`Increase to ${mode} due to ${item.shortname} on ${column} and ${location_type}`);
                  // console.log(`share ${share}`);
                  // console.log(`factor ${SCALING_FACTORS[type]}`);
                  // console.log(`benefit ${benefit.mean / 100}`)

                  for(let estimate of ESTIMATES) {

                    Vmj_projected[column][mode][location_type][estimate] += (
                        Vmj_existing[column][mode][location_type] *
                        (benefit[estimate] / 100) *
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
  }

  // calc combined for Vmj_existing and Vmj_projected
  for(let column of COLUMNS) {

    Vmj_existing[column].combined = {};
    Vmj_projected[column].combined = {};

    for(let location_type of LOCATION_TYPES) {
      Vmj_existing[column].combined[location_type] = 0;

      Vmj_projected[column].combined[location_type] = {};

      for(let estimate of ESTIMATES) {
        Vmj_projected[column].combined[location_type][estimate] = 0;
      }
    }

    for(let mode of MODES) {
      for(let location_type of LOCATION_TYPES) {
        Vmj_existing[column].combined[location_type] += Vmj_existing[column][mode][location_type];

        for(let estimate of ESTIMATES) {
          Vmj_projected[column].combined[location_type][estimate] +=
            Vmj_projected[column][mode][location_type][estimate];
        }
      }
    }
  }

  // console.log(Vmj_existing.safety);
  // console.log(Vmj_projected.safety);
  // console.log(Lmjvf);

  // generate output for each set of columns in the safety benefits table
  let benefits = {};

  for(let column of COLUMNS) {
    benefits[column] = _calc(Vmj_existing[column], Vmj_projected[column], Lmjvf, selectedInfrastructure);
  }

  console.log(benefits);

  return benefits;
}

export default calcSafetyQuantitative;
