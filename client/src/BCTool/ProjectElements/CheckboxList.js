import React from 'react';

import Checkbox from './Checkbox';

class CheckboxList extends React.Component {
    render() {

        let { items, onChange } = this.props;

        return (
            <>
            {
                items.map((item) =>
                    <Checkbox
                        key={item.shortname}
                        label={item.label}
                        shortname={item.shortname}
                        checked={item.selected}
                        onChange={onChange}
                    />
                )
            }
            </>
        );
    }
}

export default CheckboxList;