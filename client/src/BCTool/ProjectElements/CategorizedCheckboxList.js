import React from 'react';

import CheckboxList from './CheckboxList';

class CategorizedCheckboxList extends React.Component {

    onChange = (shortname, value) => {

        let { onChange, category } = this.props;

        onChange(category.shortname, shortname, value);
    }

    render() {

        let { category } = this.props;

        return (
            <>
            <div className="mb-3">
                <h6 className="dropdown-header">{category.label}</h6>
                <CheckboxList
                    items={category.items}
                    onChange={this.onChange}
                />
            </div>
            </>
        );
    }
}

export default CategorizedCheckboxList;
