import React from 'react';

import CheckboxList from './CheckboxList';

class CheckboxDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.buildButtonText = this.buildButtonText.bind(this);
    }

    buildButtonText() {

        let selectedText = [];

        for(let i = 0; i < this.props.items.length; i++) {
            if(this.props.items[i]['selected']) {
                selectedText.push(this.props.items[i]['label']);
            }
        }

        if(selectedText.length) {
            return selectedText.join(", ");
        }

        return this.props.buttonText;
    }

    render() {

        const items = this.props.items;
        const onChange = this.props.onChange;
        const name = this.props.name;

        return (
            <div className="dropdown d-grid gap-2">
              <button className="btn btn-secondary btn-lg dropdown-toggle"
                data-bs-auto-close="outside"
                type="button"
                id={"dropdown-"+name}
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {this.buildButtonText()}
              </button>
              <div className="dropdown-menu" aria-labelledby={"dropdown-"+name}>
                <form className="px-4 py-3">
                    <CheckboxList
                        items={items}
                        onChange={onChange}
                    />
                </form>
              </div>
            </div>
        );
    }
}

export default CheckboxDropdown;