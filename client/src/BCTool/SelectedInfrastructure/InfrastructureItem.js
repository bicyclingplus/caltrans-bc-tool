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

    render() {
        let { label, counts, blockFaces, intersections } = this.props;

        return (
            <tr>
                <td>{label}</td>

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