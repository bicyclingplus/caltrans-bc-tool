import React from 'react';

import InfrastructureItem from './InfrastructureItem';

class InfrastructureCategory extends React.Component {

    render() {
        let { category, onValueChange, onTypeChange } = this.props;

        return (
            <>
            <div className="mb-5">
            <h5>{category.label}</h5>
            <table className="table">
                <thead>
                    <tr>
                        <th width="25%"></th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        category.items
                            .filter((item) => (item.selected))
                            .map((item) => (
                                <InfrastructureItem
                                    key={item.shortname}
                                    shortname={item.shortname}
                                    label={item.label}
                                    value={item.value}
                                    units={item.units}
                                    onValueChange={onValueChange}
                                    onTypeChange={onTypeChange}
                                    type={item.type}
                                />
                            ))
                    }
                </tbody>
            </table>
            </div>
            </>
        );
    }

}

export default InfrastructureCategory;