import React from 'react';

import InfrastructureCategory from './InfrastructureCategory';

class SelectedInfrastructure extends React.Component {

    render() {

        let {
          categories,
          onChange,
          multi,
          selections
        } = this.props;

        let infrastructureCategories = [];
        let shortnames = Object.keys(selections);

        for(let category of categories) {

          let hasSelectedItems = false;

          for(let item of category.items) {
            if(shortnames.includes(item.shortname)) {
              hasSelectedItems = true;
              break;
            }
          }

          if(hasSelectedItems) {
            infrastructureCategories.push(
                <InfrastructureCategory
                    key={category.shortname}
                    category={category}
                    onChange={onChange}
                    selections={selections}
                />
            )
          }
        }

        return (
          <div>
            <h4 className="text-center section-header">Selected Infrastructure Elements</h4>

            { multi ?
            <p className="mt-5 mb-5 text-primary">
              With multi element interventions selected, your project's benefits will reflect research for that type of intervention.
              If you also select a separate element that is commonly part of the selected multi element intervention (ie selecting road diet and protected bike lanes), your project's benefits will be too high unless your project involves protected bike lanes and a road diet in different places within the scope.
            </p>
            : null }

            {infrastructureCategories}
          </div>
        );
    }

}

export default SelectedInfrastructure;