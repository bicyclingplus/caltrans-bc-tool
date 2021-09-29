import React from 'react';

class Checkbox extends React.Component {

    onChange = (e) => {

        let { onChange, shortname } = this.props;

        onChange(shortname, e.target.checked);
    }

    render() {

        let { checked, label, shortname } = this.props;

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
