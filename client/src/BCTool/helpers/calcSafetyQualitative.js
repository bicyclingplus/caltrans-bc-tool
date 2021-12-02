const qualitative = require('../data/qualitative.json');

function calcSafetyQualitative(infrastructure) {

  let benefits = [];

  // Go through each infrastructure category
  for(let category of infrastructure.categories) {

      // Go through each infrastructure element in this category
      for(const item of category.items) {

          // Check if this element is selected
          if(item.selected && item.shortname in qualitative) {

            let shortname = item.shortname;

            // lighting could now be either lighting-block-face or lighting-intersection
            // but there is only one qualitative benefit entry for lighting, so
            // we take that if either are selected
            if(item.shortname.startsWith('lighting')) {
              shortname = 'lighting';
            }

            benefits.push({
              element: item.label,
              benefits: qualitative[shortname].map((benefit, idx) => (
                {
                  'key': `${shortname}-${idx}`,
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
