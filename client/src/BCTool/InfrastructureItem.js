import React from 'react';

class infrastructureItem extends React.Component {

    render() {
        let name = this.props.name;

        return (
            <li>{name}</li>
        );
    }

}

export default infrastructureItem;