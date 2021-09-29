import React from 'react';

import InfrastructureItem from './InfrastructureItem';

class InfrastructureCategory extends React.Component {

    render() {
        let { category, onItemChange } = this.props;

        return (
            <>
            <h5>{category.label}</h5>
            <table className="table mb-3">
                <thead>
                    <tr>
                        <th width="50%"></th>
                        { category.corridors ? <th>Corridors</th> : null }
                        { category.intersections ? <th>Intersections</th> : null }
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
                                    counts={item.counts}
                                    corridors={category.corridors}
                                    intersections={category.intersections}
                                    onItemChange={onItemChange}
                                />
                            ))
                    }
                </tbody>
            </table>
            </>
        );
    }

}

export default InfrastructureCategory;