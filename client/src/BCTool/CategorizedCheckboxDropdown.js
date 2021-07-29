import React from 'react';

import CategorizedCheckboxList from './CategorizedCheckboxList';

class CategorizedCheckboxDropdown extends React.Component {

    render() {

        const buttonText = this.props.buttonText;
        const items = this.props.items;
        const checkboxes = this.props.checkboxes;
        const onCheckedChange = this.props.onCheckedChange;

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
            <div className="dropdown">
              <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                {buttonText}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <form className="px-4 py-3">
                    {categorizedCheckboxLists}
                </form>
              </div>
            </div>
        );
    }
}

export default CategorizedCheckboxDropdown;