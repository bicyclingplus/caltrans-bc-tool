import React from 'react';

import InfrastructureItem from './InfrastructureItem';

class InfrastructureCategory extends React.Component {

    render() {
        let { items, name, onItemChange } = this.props;

        let infrastructureItems = [];

        for(let i = 0; i < items.length; i++) {
            if(items[i]['selected']) {
                infrastructureItems.push(
                    <InfrastructureItem
                        key={items[i]['shortname']}
                        shortname={items[i]['shortname']}
                        label={items[i]['label']}
                        count={items[i]['count']}
                        onItemChange={onItemChange}
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
                        <th width="50%"></th>
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