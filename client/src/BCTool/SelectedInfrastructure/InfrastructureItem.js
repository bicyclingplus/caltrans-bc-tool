import React from 'react';

class infrastructureItem extends React.Component {

    onBlockFacesChange = (e) => {
        let { shortname, onItemChange } = this.props;

        onItemChange(shortname, 'blockFaces', e.target.value);
    }

    onIntersectionsChange = (e) => {
        let { shortname, onItemChange } = this.props;

        onItemChange(shortname, 'intersections', e.target.value);
    }

    onTypeChange = (e) => {
        let { shortname, onTypeChange } = this.props;

        onTypeChange(shortname, e.target.value);
    }

    render() {
        let { label, counts, blockFaces, intersections, type } = this.props;

        return (
            <tr>
                <td>{label}</td>

                <td>
                    <select className="form-select" value={type} onChange={this.onTypeChange}>
                        <option value="" disabled>-- Select a Type --</option>
                        <option value="new">New Construction</option>
                        <option value="upgrade">Significant Upgrade</option>
                        <option value="retrofit">Retrofit/Maintenance</option>
                    </select>
                </td>

                { blockFaces ?
                <td><input className="form-control" type="number" value={counts.blockFaces} onChange={this.onBlockFacesChange} /></td>
                : null }

                { intersections ?
                <td><input className="form-control" type="number" value={counts.intersections} onChange={this.onIntersectionsChange} /></td>
                : null }
            </tr>
        );
    }

}

export default infrastructureItem;