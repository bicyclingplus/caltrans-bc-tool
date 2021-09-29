import React from 'react';

class infrastructureItem extends React.Component {

    onCorridorsChange = (e) => {
        let { shortname, onItemChange } = this.props;

        onItemChange(shortname, 'corridors', e.target.value);
    }

    onIntersectionsChange = (e) => {
        let { shortname, onItemChange } = this.props;

        onItemChange(shortname, 'intersections', e.target.value);
    }

    render() {
        let { label, counts, corridors, intersections } = this.props;

        return (
            <tr>
                <td>{label}</td>

                { corridors ?
                <td><input className="form-control" type="number" value={counts.corridors} onChange={this.onCorridorsChange} /></td>
                : null }

                { intersections ?
                <td><input className="form-control" type="number" value={counts.intersections} onChange={this.onIntersectionsChange} /></td>
                : null }
            </tr>
        );
    }

}

export default infrastructureItem;