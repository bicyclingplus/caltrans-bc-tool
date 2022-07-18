
import calcProjectQualitative from './calcProjectQualitative';
import calcTravel from './calcTravel';
import calcVMTReductions from './calcVMTReductions';
import calcHealth from './calcHealth';
import calcEmissions from './calcEmissions';
import calcSafetyQualitative from './calcSafetyQualitative';
import calcSafetyQuantitative from './calcSafetyQuantitative';

const calcBenefits = (
	project_type,
	project_subtype,

	project_county,
	project_year,

	project_time_frame,

	project_length,
	num_intersections,

	infrastructure,

	existingTravel,

	selectedInfrastructure,
	selectedNonInfrastructure
	) => {

	let benefits = {};

	benefits.projectQualitative = calcProjectQualitative(
		selectedInfrastructure, selectedNonInfrastructure);

	if(project_type === 'infrastructure' || project_type === 'both') {

      benefits.travel = calcTravel(
      	infrastructure,
      	selectedInfrastructure,
      	existingTravel,
      	project_length,
      	num_intersections);

      benefits.vmtReductions = calcVMTReductions(benefits.travel, project_time_frame);

      benefits.emissions = calcEmissions(
        project_county, project_year, benefits.vmtReductions);

      benefits.health = calcHealth(benefits.travel, project_time_frame);

      benefits.safetyQualitative = calcSafetyQualitative(infrastructure, selectedInfrastructure);

      benefits.safetyQuantitative = calcSafetyQuantitative(
        infrastructure,
        benefits.travel,
        project_length,
        num_intersections,
        project_subtype,
        project_time_frame,
        selectedInfrastructure);
    }

    // console.log(benefits);
    console.log(project_length);

    return benefits;
}

export default calcBenefits;