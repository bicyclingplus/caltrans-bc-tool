import React from 'react';

import Checkbox from './Checkbox';

class CheckboxList extends React.Component {
    render() {

        const items = this.props.items;
        const onChange = this.props.onChange;

        let checkboxComponents = items.map((item) =>
            <Checkbox
                key={item.label}
                label={item.label}
                shortname={item.shortname}
                checked={item.selected}
                onChange={onChange}
            />
        );

        return (
            <>
                {checkboxComponents}
            </>
        );
    }
}

export default CheckboxList;