import React from 'react';

import CheckboxList from './CheckboxList';

class CategorizedCheckboxList extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(shortname, value) {
        this.props.onChange(
            this.props.category,
            shortname,
            value,
        );
    }

    render() {

        const category = this.props.category;
        const items = this.props.items;

        return (
            <div className="col-sm-4">
                <h6 className="dropdown-header">{category}</h6>
                <CheckboxList
                    items={items}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default CategorizedCheckboxList;