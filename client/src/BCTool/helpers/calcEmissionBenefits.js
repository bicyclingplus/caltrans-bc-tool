const fleet_makeup = require('../data/fleet_makeup.json');
const emission_rates = require('../data/emission_rates.json');

const LIFE_OF_PROJECT = 15; // specified in docs for these calcs

function calcEmissionBenefits(county, year, vmtReductions) {

  const futureYear = year + LIFE_OF_PROJECT;

  console.log('Trying to calculate emission benefits');

  if(! (county in fleet_makeup)) {
    console.log('Missing fleet makeup for: '+county);
    return [];
  }

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

  if(! (futureYear in emission_rates[county])) {
    console.log('Missing emission rates for start year '+ futureYear + ' for county '+county);
    return [];
  }

  // Should be good to go on lookups

  let totalVmtReductions = 0;

  // Just using mean for now as this was not specified
  // we have a lower, mean, and upper bound available
  // add up vmt reductions for bike and ped
  // (could also be only ped)
  for(let reduction of vmtReductions) {
    totalVmtReductions+= reduction['mean'];
  }

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
      avgEmissionRates[vehType][type] = (emission_rates[county][year][vehType][type] +
        emission_rates[county][futureYear][vehType][type]) / 2;
    }
  }

  let vehVMTReductions = {};

  for(let vehType of vehicleTypes) {
    vehVMTReductions[vehType] = (fleet_makeup[county][vehType] /
      fleet_makeup[county]['Total']) * totalVmtReductions;
  }

  let vehEmissionsReductions = [];


  for(let vehType of vehicleTypes) {

    let current = {
      'type': vehType,
    }

    for(let emissionType of emissionTypes) {
      current[emissionType] = vehVMTReductions[vehType] *
        avgEmissionRates[vehType][emissionType];
    }

    vehEmissionsReductions.push(current);
  }

  console.log(vehEmissionsReductions);

  return vehEmissionsReductions;

}

export default calcEmissionBenefits;
