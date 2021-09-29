import React from 'react';

import InfrastructureCategory from './InfrastructureCategory';

class SelectedInfrastructure extends React.Component {

    render() {

        let { categories, onItemChange } = this.props;
        let infrastructureCategories = [];

        for(let category of categories) {

          let hasSelectedItems = false;

          for(let item of category.items) {
            if(item.selected) {
              hasSelectedItems = true;
              break;
            }
          }

          if(hasSelectedItems) {
            infrastructureCategories.push(
                <InfrastructureCategory
                    key={category.shortname}
                    category={category}
                    onItemChange={onItemChange}
                />
            )
          }
        }

        return (
            <div className="card">
              <div className="card-body">
                  <h4 className="card-title text-center">Selected Infrastructure Elements</h4>
                  {infrastructureCategories}
              </div>
            </div>
        );
    }

}

export default SelectedInfrastructure;