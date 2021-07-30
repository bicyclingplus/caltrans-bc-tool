import React from 'react';

import CheckboxList from './CheckboxList';

class CategorizedCheckboxList extends React.Component {

    render() {

        const category = this.props.category;
        const items = this.props.items;
        const checkboxes = this.props.checkboxes;
        const onCheckedChange = this.props.onCheckedChange;

        return (
            <div className="col-sm-4">
                <h6 className="dropdown-header">{category}</h6>
                <CheckboxList
                    items={items}
                    checkboxes={checkboxes}
                    onCheckedChange={onCheckedChange}
                />
            </div>
        );
    }
}

export default CategorizedCheckboxList;