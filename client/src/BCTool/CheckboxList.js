import React from 'react';

import Checkbox from './Checkbox';

class CheckboxList extends React.Component {
    render() {

        const items = this.props.items;
        const checkboxes = this.props.checkboxes;
        const onCheckedChange = this.props.onCheckedChange

        let checkboxComponents = items.map((item) => 
            <Checkbox
                key={item.label}
                label={item.label}
                shortname={item.shortname}
                checked={checkboxes[item]}
                onCheckedChange={onCheckedChange}
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