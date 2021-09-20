import React from 'react';

import InfrastructureCategory from './InfrastructureCategory';

class SelectedInfrastructure extends React.Component {

    render() {

        let items = this.props.items;
        let infrastructureCategories = [];

        for(let category in items) {

          let hasSelectedItems = false;

          for(let i = 0; i < items[category].length; i++) {
            if(items[category][i]['selected']) {
              hasSelectedItems = true;
              break;
            }
          }

          if(hasSelectedItems) {
            infrastructureCategories.push(
                <InfrastructureCategory
                    key={category}
                    name={category}
                    items={items[category]}
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