import React from 'react';

import InfrastructureItem from './InfrastructureItem';

class InfrastructureCategory extends React.Component {

    render() {
        let { category, onChange, selections } = this.props;

        let shortnames = Object.keys(selections);

        return (
            <>
            <div className="mb-5">
            <h5>{category.label}</h5>
            <table className="table">
                <thead>
                    <tr>
                        <th width="33%"></th>
                        <th width="33%">Type</th>
                        <th>Length or Count of Element</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        category.items
                            .filter((item) => (shortnames.includes(item.shortname)))
                            .map((item) => (
                                <InfrastructureItem
                                    key={item.shortname}
                                    shortname={item.shortname}
                                    label={item.label}
                                    newValue={selections[item.shortname].new}
                                    upgradeValue={selections[item.shortname].upgrade}
                                    retrofitValue={selections[item.shortname].retrofit}
                                    units={item.units}
                                    onChange={onChange}
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