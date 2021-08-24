import React from 'react';

class Checkbox extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.onChange(
            this.props.shortname,
            e.target.checked
        );
    }

    render() {
        const checked = this.props.checked;
        const label = this.props.label;
        const shortname = this.props.shortname;

        return (
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={"check-"+shortname}
                    checked={checked}
                    onChange={this.onChange} />
                <label
                    className="form-check-label"
                    htmlFor={"check-"+shortname}>
                    {label}
                </label>
            </div>
        )
    }
}

export default Checkbox;
