import calcDiscount from './calcDiscount';

const BIKE_FACTOR = 0.506;
const PED_FACTOR = 0.646;
const CARPOOL_FACTOR = 0.87;

const TRANSIT_WALK_FRACTION = {
  hubs: 0.5,
  stops: 0.1,
  none: 0.0,
};

const TRANSIT_FACTOR = 13.67;


function _calc(travel, time_frame, transit) {

  // daily bike vmt benefits
  let bike_lower = (
    travel.bike.carShift.lower *
    CARPOOL_FACTOR *
    BIKE_FACTOR
  );

  let bike_mean = (
    travel.bike.carShift.mean *
    CARPOOL_FACTOR *
    BIKE_FACTOR
  );

  let bike_upper = (
    travel.bike.carShift.upper *
    CARPOOL_FACTOR *
    BIKE_FACTOR
  );

  // daily ped vmt benefits
  let ped_lower = ((
    travel.pedestrian.carShift.lower *
    CARPOOL_FACTOR *
    PED_FACTOR *
    (1 - TRANSIT_WALK_FRACTION[transit])
  ) + (
    travel.pedestrian.carShift.lower *
    PED_FACTOR *
    TRANSIT_WALK_FRACTION[transit] *
    TRANSIT_FACTOR
  ));

  let ped_mean = ((
    travel.pedestrian.carShift.mean *
    CARPOOL_FACTOR *
    PED_FACTOR *
    (1 - TRANSIT_WALK_FRACTION[transit])
  ) + (
    travel.pedestrian.carShift.mean *
    PED_FACTOR *
    TRANSIT_WALK_FRACTION[transit] *
    TRANSIT_FACTOR
  ));

  let ped_upper = ((
    travel.pedestrian.carShift.upper *
    CARPOOL_FACTOR *
    PED_FACTOR *
    (1 - TRANSIT_WALK_FRACTION[transit])
  ) + (
    travel.pedestrian.carShift.upper *
    PED_FACTOR *
    TRANSIT_WALK_FRACTION[transit] *
    TRANSIT_FACTOR
  ));

  // combine and annualize
  let combined_lower = (bike_lower + ped_lower) * 365;
  let combined_mean = (bike_mean + ped_mean) * 365;
  let combined_upper = (bike_upper + ped_upper) * 365;

  // calculate benefits over project time frame
  return {
    'lower': calcDiscount(combined_lower, time_frame),
    'mean': calcDiscount(combined_mean, time_frame),
    'upper': calcDiscount(combined_upper, time_frame),
  };
}

function calcVMTReductions(travel, time_frame, transit) {

  return {
    'miles': _calc(travel.miles, time_frame, transit),
    'capita': _calc(travel.capita, time_frame, transit),
    'jobs': _calc(travel.jobs, time_frame, transit),
  };
}

export default calcVMTReductions;
