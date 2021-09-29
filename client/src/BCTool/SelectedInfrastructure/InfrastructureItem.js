import React from 'react';

class infrastructureItem extends React.Component {

    onChange = (e) => {
        let { shortname, onItemChange } = this.props;

        onItemChange(shortname, e.target.value);
    }

    render() {
        let { label, count } = this.props;

        return (
            <tr>
                <td>{label}</td>
                <td><input className="form-control" type="number" value={count} onChange={this.onChange} /></td>
            </tr>
        );
    }

}

export default infrastructureItem;