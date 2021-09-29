import React from 'react';

import CategorizedCheckboxList from './CategorizedCheckboxList';

class CategorizedCheckboxDropdown extends React.Component {

    buildButtonText = () => {

        let selectedText = [];
        let { categories, buttonText } = this.props;

        for(let category of categories) {

            for(let item of category.items) {
                if(item.selected) {
                    selectedText.push(item.['label']);
                }
            }
        }

        if(selectedText.length) {
            let list = selectedText.join(", "),
                maxLength = parseInt(this.props.maxLength),
                trimmed = list.substring(0, maxLength).trim() + "...";

            return list.length > maxLength ? trimmed : list;
        }

        // default to cue to click the dropdown
        return buttonText;
    }

    render() {

        const buttonText = this.buildButtonText();
        let { categories, onChange, name } = this.props;

        let categorizedCheckboxLists = [];

        for(let category of categories) {
            categorizedCheckboxLists.push(
                <CategorizedCheckboxList
                    key={category.shortname}
                    category={category}
                    onChange={onChange}
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