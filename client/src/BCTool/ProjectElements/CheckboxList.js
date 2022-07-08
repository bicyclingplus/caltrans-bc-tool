import React from 'react';

import Checkbox from './Checkbox';

class CheckboxList extends React.Component {
    render() {

        let { items, onChange, selected } = this.props;
        let shortnames = Object.keys(selected);

        return (
            <>
            {
                items.map((item) =>
                    <Checkbox
                        key={item.shortname}
                        label={item.label}
                        shortname={item.shortname}
                        checked={shortnames.includes(item.shortname)}
                        onChange={onChange}
                    />
                )
            }
            </>
        );
    }
}

export default CheckboxList;