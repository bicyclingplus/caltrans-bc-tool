import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { readableNumber } from '../helpers/formatting';

const Tooltip = require('bootstrap/js/dist/tooltip');

class SafetyQuantitative extends React.Component {

	componentDidMount() {
        this.tooltips = [];

        let tooltip_ids = [
        	'safety-benefits-tooltip',
        	'safety-benefits-capita-tooltip',
        	'safety-benefits-jobs-tooltip',
        ];

        for(let tooltip_id of tooltip_ids) {
        	this.tooltips.push(new Tooltip(document.getElementById(tooltip_id)));
        }
    }

    componentWillUnmount() {
        for(let tooltip of this.tooltips) {
        	tooltip.dispose();
        }
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
						<th colSpan="3" className="text-center">
							Benefit (Reduction miles) / Capita
							<i id={`safety-benefits-capita-tooltip`}
	                        className="bi bi-info-circle ms-2"
	                        data-bs-toggle="tooltip"
	                        data-bs-placement="right"
	                        data-bs-html="true"
	                        title="Reduction miles is the percent reduction multiplied by the miles of travel in the project."></i></th>
						<th colSpan="3" className="text-center">
							Benefit (Reduction miles) / Jobs
							<i id={`safety-benefits-jobs-tooltip`}
		                        className="bi bi-info-circle ms-2"
		                        data-bs-toggle="tooltip"
		                        data-bs-placement="right"
		                        data-bs-html="true"
		                        title="Reduction miles is the percent reduction multiplied by the miles of travel in the project."></i>
						</th>
					</tr>
					<tr>
						<th></th>
						<th className="text-center">Parameter</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
					</tr>
				</thead>
				<tbody>
					<tr><th rowSpan="6" className="align-middle">Bike</th>
						<td className="text-center">Crashes</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.upper)}</td>

					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.upper)}</td>
					</tr>

					<tr style={{"borderTopWidth": "2px", "borderTopColor": "currentColor"}}>
						<th rowSpan="6" className="align-middle">Pedestrian</th>
						<td className="text-center">Crashes</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.upper)}</td>

					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.upper)}</td>
					</tr>

					<tr style={{"borderTopWidth": "2px", "borderTopColor": "currentColor"}}>
						<th rowSpan="6" className="align-middle">Combined</th>
						<td className="text-center">Crashes</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crashes.upper)}</td>

					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.injuries.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.deaths.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.speed.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.yielding.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.miles.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.miles.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.miles.crime.upper)}</td>
					</tr>
				</tbody>
			</table>
			</>
		);
	};
}

export default SafetyQuantitative;
