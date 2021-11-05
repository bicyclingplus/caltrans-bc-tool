import React from 'react';

import CountInput from './CountInput';
import LengthInput from './LengthInput';

class infrastructureItem extends React.Component {

    onValueChange = (e) => {
        let { shortname, onValueChange } = this.props;

        onValueChange(shortname, e.target.value);
    }

    onTypeChange = (e) => {
        let { shortname, onTypeChange } = this.props;

        onTypeChange(shortname, e.target.value);
    }

    render() {
        let { label, value, units, type, shortname } = this.props;

        return (
            <tr>
                <td>{label}</td>

                <td>
                    <select className="form-select" value={type} onChange={this.onTypeChange}>
                        <option value="" disabled>-- Select a Type --</option>
                        <option value="new">New Construction</option>
                        <option value="upgrade">Significant Upgrade</option>
                        <option value="retrofit">Retrofit/Maintenance</option>
                    </select>
                </td>

                <td>
                { units === 'length' ?
                <LengthInput shortname={shortname} value={value} onChange={this.onValueChange} />
                :
                <CountInput shortname={shortname} value={value} onChange={this.onValueChange} />
                }
                </td>
            </tr>
        );
    }

}

export default infrastructureItem;