import {
    ESTIMATES,
    BIKE_FACTOR,
    PED_FACTOR,
    CARPOOL_FACTOR,
    TRANSIT_FACTOR,
    TRANSIT_WALK_FRACTION,
} from './constants';

import calcDiscount from './calcDiscount';

const _calcBike = (travel) => {
  return (
    travel *
    CARPOOL_FACTOR *
    BIKE_FACTOR
  );
};

const _calcPed = (travel, transit) => {
  return ((
    travel *
    CARPOOL_FACTOR *
    PED_FACTOR *
    (1 - TRANSIT_WALK_FRACTION[transit])
  ) + (
    travel *
    PED_FACTOR *
    TRANSIT_WALK_FRACTION[transit] *
    TRANSIT_FACTOR
  ));
};

const _calc = (travel, time_frame, transit) => {

  let benefits = {};

  for(let estimate of ESTIMATES) {

    // daily bike and ped vmt benefits
    let combined = (
      _calcBike(travel.bike.carShift[estimate]) +
      _calcPed(travel.pedestrian.carShift[estimate], transit)
    );

    // annualize and calc benefits over project time frame
    benefits[estimate] = calcDiscount(combined * 365, time_frame);
  }

  return benefits;
};

const calcVMTReductions = (travel, time_frame, transit) => {

  return {
    miles: _calc(travel.miles, time_frame, transit),
    capita: _calc(travel.capita, time_frame, transit),
    jobs: _calc(travel.jobs, time_frame, transit),
  };
};

export default calcVMTReductions;
