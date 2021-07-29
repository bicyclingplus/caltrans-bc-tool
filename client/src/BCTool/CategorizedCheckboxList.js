import React from 'react';

import CheckboxList from './CheckboxList';

class CategorizedCheckboxList extends React.Component {

    render() {

        const category = this.props.category;
        const items = this.props.items;
        const checkboxes = this.props.checkboxes;
        const onCheckedChange = this.props.onCheckedChange;

        return (
            <>
                <h6 className="dropdown-header">{category}</h6>
                <CheckboxList
                    items={items}
                    checkboxes={checkboxes}
                    onCheckedChange={onCheckedChange}
                />
            </>
        );
    }
}

export default CategorizedCheckboxList;