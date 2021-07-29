import React from 'react';

import Checkbox from './Checkbox';

class CategorizedCheckboxDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
			'checked': true,
		};

		console.log(this.props.items);

        this.updateBoxes = this.updateBoxes.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

	updateBoxes(value) {
		this.setState({
		  'checked': value,
		});
	}

    render() {

        const buttonText = this.props.buttonText;
        const items = this.props.items;

        return (
            <div className="dropdown">
              <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                {buttonText}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <form className="px-4 py-3">

                {for(let category in items)}

                  <h6 className="dropdown-header">Amenity</h6>

                  <Checkbox label="Bike Parking" shortname="bike-parking" checked={this.state.checked} onCheckedChange={this.updateBoxes} />
                  <Checkbox label="Bikeshare Infrastructure" shortname="bikeshare-infrastructure" checked={this.state.checked} onCheckedChange={this.updateBoxes} />
                </form>
              </div>
            </div>
      )
    }
}

export default CategorizedCheckboxDropdown;