import React from 'react';

import InfrastructureItem from './InfrastructureItem';

class InfrastructureCategory extends React.Component {

    render() {
        let { items, name } = this.props;

        let infrastructureItems = [];

        for(let i = 0; i < items.length; i++) {
            if(items[i]['selected']) {
                infrastructureItems.push(
                    <InfrastructureItem
                        key={items[i]['shortname']}
                        name={items[i]['label']}
                        count={items[i]['count']}
                    />
                )
            }
        }

        return (
            <>
            <h5>{name}</h5>
            <table className="table mb-3">
                <thead>
                    <tr>
                        <th></th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {infrastructureItems}
                </tbody>
            </table>
            </>
        );
    }

}

export default InfrastructureCategory;