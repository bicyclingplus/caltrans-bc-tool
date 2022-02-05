import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { readableNumber } from '../helpers/formatting';

const Tooltip = require('bootstrap/js/dist/tooltip');

class SafetyQuantitative extends React.Component {

	componentDidMount() {
        this.tooltip = new Tooltip(document.getElementById(`safety-benefits-tooltip`));
    }

    componentWillUnmount() {
        this.tooltip.dispose();
    }

	render = () => {

		let { benefits } = this.props;

		return (
			<>
			<h5 className="mt-4">Safety</h5>
			<table className="table table-bordered">
				<thead>
					<tr>
						<th></th>
						<th colSpan="3" className="text-center">
							Benefit (Reduction miles)
							<i id={`safety-benefits-tooltip`}
	                        className="bi bi-info-circle ms-2"
	                        data-bs-toggle="tooltip"
	                        data-bs-placement="right"
	                        data-bs-html="true"
	                        title="Reduction miles is the percent reduction multiplied by the miles of travel in the project."></i>
                        </th>
						<th colSpan="3" className="text-center">Benefit / Capita</th>
					</tr>
					<tr>
						<th></th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="text-center">Crashes</td>
						<td className="text-end">{readableNumber(benefits.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.crashes.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.injuries.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr style={{"borderBottomWidth": "thick", "borderBottomColor": "grey"}}>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.deaths.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.speed.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.yielding.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.crime.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>
			</table>

			<table className="table table-bordered">
				<thead>
					<tr>
						<th></th>
						<th colSpan="3" className="text-center">Benefit</th>
						<th colSpan="3" className="text-center">Benefit / Capita</th>
					</tr>
					<tr>
						<th></th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="text-center">Crashes</td>
						<td className="text-end">{readableNumber(benefits.percents.crashes.lower)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.crashes.mean)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.crashes.upper)}%</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.percents.injuries.lower)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.injuries.mean)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.injuries.upper)}%</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr style={{"borderBottomWidth": "thick", "borderBottomColor": "grey"}}>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.percents.deaths.lower)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.deaths.mean)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.deaths.upper)}%</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.percents.speed.lower)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.speed.mean)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.speed.upper)}%</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.percents.yielding.lower)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.yielding.mean)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.yielding.upper)}%</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.percents.crime.lower)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.crime.mean)}%</td>
						<td className="text-end">{readableNumber(benefits.percents.crime.upper)}%</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>
			</table>
			</>
		);
	};
}

export default SafetyQuantitative;
