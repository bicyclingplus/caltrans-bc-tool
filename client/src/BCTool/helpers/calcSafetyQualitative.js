const qualitative = require('../data/qualitative.json');

function calcSafetyQualitative(infrastructure) {

  let benefits = [];

  // Go through each infrastructure category
  for(let category in infrastructure) {

      // Go through each infrastructure element in this category
      for(const element of infrastructure[category]) {

          // Check if this element is selected
          if(element.selected && element.shortname in qualitative) {

            benefits.push({
              element: element.label,
              benefits: qualitative[element.shortname].map((benefit, idx) => (
                {
                  'key': `${element.shortname}-${idx}`,
                  'element': element.label,
                  'description': benefit.description,
                  'sources': benefit.sources,
                }
              )),
            });

          }
      }
  }

  return benefits;

}

export default calcSafetyQualitative;
