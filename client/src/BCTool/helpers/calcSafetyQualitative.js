const qualitative = require('../data/qualitative.json');

function calcSafetyQualitative(infrastructure) {

  let benefits = [];

  // Go through each infrastructure category
  for(let category of infrastructure.categories) {

      // Go through each infrastructure element in this category
      for(const item of category.items) {

          // Check if this element is selected
          if(item.selected && item.shortname in qualitative) {

            benefits.push({
              element: item.label,
              benefits: qualitative[item.shortname].map((benefit, idx) => (
                {
                  'key': `${item.shortname}-${idx}`,
                  'element': item.label,
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
