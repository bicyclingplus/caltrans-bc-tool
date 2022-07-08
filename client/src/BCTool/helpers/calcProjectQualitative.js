const projectQualitative = require('../data/project_qualitative.json');

function calcProjectQualitative(selectedInfrastructure, selectedNonInfrastructure) {

	let combinedElements = [
		...Object.keys(selectedInfrastructure),
		...selectedNonInfrastructure
	];

	let benefits = [];
	let benefitNames = [];

	for(let benefit of projectQualitative.benefits) {

		if(benefit.type === "always") {
			benefits.push({
				"name": benefit.name,
				"description": benefit.description,
			});

			benefitNames.push(benefit.name);
		}
		else if(benefit.type === "element") {

			let present = false;

			for(let element of benefit.elements) {
				if(combinedElements.includes(element)) {
					present = true;
					break;
				}
			}

			if(present) {
				benefits.push({
					"name": benefit.name,
					"description": benefit.description.present,
				});

				benefitNames.push(benefit.name);
			}
			else {
				benefits.push({
					"name": benefit.name,
					"description": benefit.description['not-present'],
				});
			}
		}
	}

	for(let benefit of projectQualitative.benefits) {
		if(benefit.type === "dependent") {

			if(benefitNames.includes(benefit.parent)) {
				benefits.push({
					"name": benefit.name,
					"description": benefit.description.present,
				});

				benefitNames.push(benefit.name);
			}
			else {
				benefits.push({
					"name": benefit.name,
					"description": benefit.description['not-present'],
				});
			}

		}
	}

	return benefits;

}

export default calcProjectQualitative;
