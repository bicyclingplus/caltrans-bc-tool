import React from 'react';

import CategorizedCheckboxList from './CategorizedCheckboxList';

class CategorizedCheckboxDropdown extends React.Component {

    render() {

        const buttonText = this.props.buttonText;
        const items = this.props.items;
        const checkboxes = this.props.checkboxes;
        const onCheckedChange = this.props.onCheckedChange;
        const name = this.props.name;

        let categorizedCheckboxLists = [];

        for(let category in items) {
            categorizedCheckboxLists.push(
                <CategorizedCheckboxList
                    key={category}
                    category={category}
                    items={items[category]}
                    checkboxes={checkboxes}
                    onCheckedChange={onCheckedChange}
                />
            )
        }

        return (
            <div className="dropdown d-grid gap-2">
              <button className="btn btn-secondary btn-lg dropdown-toggle"
                data-bs-auto-close="outside"
                type="button" id={"dropdown-"+name}
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {buttonText}
              </button>
              <div className="dropdown-menu" aria-labelledby={"dropdown-"+name}>
                <form className="px-4 py-3">
                    <div className="row">
                        {categorizedCheckboxLists}
                    </div>
                </form>
              </div>
            </div>
        );
    }
}

export default CategorizedCheckboxDropdown;