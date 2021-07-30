import React from 'react';

import CheckboxList from './CheckboxList';

class CheckboxDropdown extends React.Component {

    render() {

        const buttonText = this.props.buttonText;
        const items = this.props.items;
        const checkboxes = this.props.checkboxes;
        const onCheckedChange = this.props.onCheckedChange;
        const name = this.props.name;

        return (
            <div className="dropdown d-grid gap-2">
              <button className="btn btn-secondary btn-lg dropdown-toggle"
                data-bs-auto-close="outside"
                type="button"
                id={"dropdown-"+name}
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {buttonText}
              </button>
              <div className="dropdown-menu" aria-labelledby={"dropdown-"+name}>
                <form className="px-4 py-3">
                    <CheckboxList
                        items={items}
                        checkboxes={checkboxes}
                        onCheckedChange={onCheckedChange}
                    />
                </form>
              </div>
            </div>
        );
    }
}

export default CheckboxDropdown;