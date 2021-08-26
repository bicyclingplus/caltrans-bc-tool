import React from 'react';

import InfrastructureItem from './InfrastructureItem';

class InfrastructureCategory extends React.Component {

    render() {
        let items = this.props.items;

        let infrastructureItems = [];

        for(let i = 0; i < items.length; i++) {
            if(items[i]['selected']) {
                infrastructureItems.push(
                    <InfrastructureItem
                        key={items[i]['shortname']}
                        name={items[i]['label']}
                    />
                )
            }
        }

        return (
            <>
            <ul className="list-unstyled mb-3">
                {infrastructureItems}
            </ul>
            </>
        );
    }

}

export default InfrastructureCategory;