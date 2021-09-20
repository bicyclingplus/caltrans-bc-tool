import React from 'react';

class infrastructureItem extends React.Component {

    render() {
        let { name, count } = this.props;

        return (
            <tr>
                <td>{name}</td>
                <td><input className="form-control" type="number" value={count} /></td>
            </tr>
        );
    }

}

export default infrastructureItem;