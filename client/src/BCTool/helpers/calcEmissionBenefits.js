const fleet_makeup = require('../data/fleet_makeup.json');
const emission_rates = require('../data/emission_rates.json');

// const LIFE_OF_PROJECT = 15; // specified in docs for these calcs

function calcEmissionBenefits(county, year, vmtReductions) {

  // const futureYear = year + LIFE_OF_PROJECT;

  console.log('Trying to calculate emission benefits');

  if(! (county in fleet_makeup)) {
    console.log('Missing fleet makeup for: '+county);
    return [];
  }

  if(! (county in emission_rates)) {
    console.log('Missing emission rates for: '+county);
    return [];
  }

  if(! (year in emission_rates[county])) {
    console.log('Missing emission rates for start year '+ year + ' for county '+county);
    return [];
  }

  // if(! (futureYear in emission_rates[county])) {
  //   console.log('Missing emission rates for future year '+ futureYear + ' for county '+county);
  //   return [];
  // }

  // Should be good to go on lookups

  let vehicleTypes = [
    "Diesel",
    "Gasoline",
    "Plug-in Hybrid",
  ];

  let emissionTypes = [
    "NOx",
    "PM2.5",
    "PM10",
    "CO2",
    "CH4",
    "N2O",
    "NH3",
    "CO",
    "SOx",
  ];

  let avgEmissionRates = {};

  for(let vehType of vehicleTypes) {
    avgEmissionRates[vehType] = {};
  }

  for(let vehType of vehicleTypes) {

    for(let type of emissionTypes) {
      avgEmissionRates[vehType][type] = emission_rates[county][year][vehType][type];

    //   avgEmissionRates[vehType][type] = (emission_rates[county][year][vehType][type] +
    //     emission_rates[county][futureYear][vehType][type]) / 2;
    }
  }

  let vehVMTReductions = {};

  for(let vehType of vehicleTypes) {

    vehVMTReductions[vehType] = {
      'lower': (fleet_makeup[county][vehType] /
                  fleet_makeup[county]['Total']) * vmtReductions.total.lower,
      'mean': (fleet_makeup[county][vehType] /
                  fleet_makeup[county]['Total']) * vmtReductions.total.mean,
      'upper': (fleet_makeup[county][vehType] /
                  fleet_makeup[county]['Total']) * vmtReductions.total.upper,
    };
  }

  let vehEmissionsReductions = {};

  for(let emissionType of emissionTypes) {

    let totals = {
      'lower': 0,
      'mean': 0,
      'upper': 0,
    };

    for(let vehType of vehicleTypes) {

      totals['lower'] += vehVMTReductions[vehType]['lower'] *
        avgEmissionRates[vehType][emissionType];

      totals['mean'] += vehVMTReductions[vehType]['mean'] *
        avgEmissionRates[vehType][emissionType];

      totals['upper'] += vehVMTReductions[vehType]['upper'] *
        avgEmissionRates[vehType][emissionType];
    }

    vehEmissionsReductions[emissionType] = totals;
  }

  return vehEmissionsReductions;

}

export default calcEmissionBenefits;
