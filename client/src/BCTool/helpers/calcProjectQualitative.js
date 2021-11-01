const projectQualitative = require('../data/project_qualitative.json');

function calcProjectQualitative(infrastructure, nonInfrastructure) {

	// console.log(infrastructure);
	// console.log(nonInfrastructure);

	let combinedElements = [];

	// Go through each infrastructure category
	for(let category of infrastructure.categories) {

		// Go through each infrastructure element in this category
		for(const item of category.items) {

			if(item.selected) {
				combinedElements.push(item.shortname);
			}
		}
	}

	for(let item of nonInfrastructure) {
		if(item.selected) {
			combinedElements.push(item.shortname);
		}
	}

	// console.log(combinedElements);

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
