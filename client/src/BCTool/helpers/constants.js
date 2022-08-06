// GENERAL

const PROJECT_TYPES = {
    infrastructure: 'Infrastructure',
    'non-infrastructure': 'Non-Infrastructure',
    both: 'Infrastructure and Non-Infrastructure',
};

const PROJECT_SUBTYPES = {
    'pedestrian-only': 'Pedestrian Only',
    'bike-only': 'Bicyclist Only',
    both: 'Pedestrian and Bicyclist',
};

const TRANSIT_TYPES = {
    hubs: 'Connections to major transit hub(s)',
    stops: 'Connections to transit stops',
    none: 'no transit connections',
};

// scale benefits for different levels
// of improvement for project elements
const SCALING_FACTORS = {
    new: 1,
    upgrade: 1,
    retrofit: 0.1,
};

// range of effect for benefits
const ESTIMATES = [
    'lower',
    'mean',
    'upper'
];

// discount rate for calculating benefits
// over the project time frame
const DISCOUNT_RATE = 0.04;

// EMISSIONS

// CO2 equivalents for different emission types
const GWPS = {
  CO2: 1,
  CH4: 28,
  N2O: 265,
};

// vehicle types in county fleets
const VEHICLE_TYPES = [
  'Diesel',
  'Gasoline',
  'Plug-in Hybrid',
];

// emission types of interest
const EMISSION_TYPES = [
  'NOx',
  'PM2.5',
  'PM10',
  'CO2',
  'CH4',
  'N2O',
  'NH3',
  'CO',
  'SOx',
];

// TRAVEL

const INDUCED_TRAVEL = {
    bicycling: 11.8,
    walking: 10.98,
};

const ROUTE_SHIFT = {
    bicycling: 58.81,
    walking: 7.73,
};

const CAR_SHIFT = {
    bicycling: 17.64,
    walking: 33.3,
};

const OTHER_SHIFT = {
    bicycling: 11.75,
    walking: 47.99,
};

// HEALTH

const WALK_SPEED = {
  lower: 1.5,
  mean: 3.0,
  upper: 4.5,
};

const BIKE_SPEED = {
  lower: 5.5,
  mean: 10.0,
  upper: 15.0,
};

const WALK_MMET = {
  lower: 2.0,
  mean: 2.5,
  upper: 7.0,
};

const BIKE_MMET = {
  lower: 2.5,
  mean: 4.8,
  upper: 9.0,
};

// VMT REDUCTIONS

const BIKE_FACTOR = 0.506;

const PED_FACTOR = 0.646;

const CARPOOL_FACTOR = 0.87;

const TRANSIT_FACTOR = 13.67;

const TRANSIT_WALK_FRACTION = {
  hubs: 0.5,
  stops: 0.1,
  none: 0.0,
};

export {
    PROJECT_TYPES,
    PROJECT_SUBTYPES,
    TRANSIT_TYPES,

    SCALING_FACTORS,
    ESTIMATES,
    DISCOUNT_RATE,

    GWPS,
    VEHICLE_TYPES,
    EMISSION_TYPES,

    INDUCED_TRAVEL,
    ROUTE_SHIFT,
    CAR_SHIFT,
    OTHER_SHIFT,

    WALK_SPEED,
    BIKE_SPEED,
    WALK_MMET,
    BIKE_MMET,

    BIKE_FACTOR,
    PED_FACTOR,
    CARPOOL_FACTOR,
    TRANSIT_FACTOR,
    TRANSIT_WALK_FRACTION,
};