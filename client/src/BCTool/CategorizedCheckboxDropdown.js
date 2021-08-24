import React from 'react';

import CategorizedCheckboxList from './CategorizedCheckboxList';

class CategorizedCheckboxDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.buildButtonText = this.buildButtonText.bind(this);
    }

    buildButtonText() {

        let selectedText = [];

        for(let category in this.props.items) {
            for(let i = 0; i < this.props.items[category].length; i++) {
                if(this.props.items[category][i]['selected']) {
                    selectedText.push(this.props.items[category][i]['label']);
                }
            }
        }

        if(selectedText.length) {
            let list = selectedText.join(", "),
                maxLength = parseInt(this.props.maxLength),
                trimmed = list.substring(0, maxLength).trim() + "...";

            return list.length > maxLength ? trimmed : list;
        }

        return this.props.buttonText;
    }

    render() {

        const buttonText = this.buildButtonText();
        const items = this.props.items;
        const onChange = this.props.onChange;
        const name = this.props.name;

        let categorizedCheckboxLists = [];

        for(let category in items) {
            categorizedCheckboxLists.push(
                <CategorizedCheckboxList
                    key={category}
                    category={category}
                    items={items[category]}
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