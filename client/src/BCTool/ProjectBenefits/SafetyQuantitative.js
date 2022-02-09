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
        	'safety-benefits-combined-tooltip'
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
						<td className="text-end">{readableNumber(benefits.miles.bike.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.bike.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.bike.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.crashes.upper)}</td>

					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.bike.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.bike.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.injuries.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.bike.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.bike.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.deaths.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.bike.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.bike.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.speed.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.bike.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.bike.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.yielding.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.bike.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.bike.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.bike.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.bike.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.bike.crime.upper)}</td>
					</tr>

					<tr style={{"borderTopWidth": "2px", "borderTopColor": "currentColor"}}>
						<th rowSpan="6" className="align-middle">Pedestrian</th>
						<td className="text-center">Crashes</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.pedestrian.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.crashes.upper)}</td>

					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.pedestrian.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.injuries.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.pedestrian.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.deaths.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.pedestrian.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.speed.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.pedestrian.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.yielding.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.pedestrian.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.pedestrian.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.pedestrian.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.pedestrian.crime.upper)}</td>
					</tr>

					<tr style={{"borderTopWidth": "2px", "borderTopColor": "currentColor"}}>
						<th rowSpan="6" className="align-middle">
							Combined
							<i id={`safety-benefits-combined-tooltip`}
	                        className="bi bi-info-circle ms-2"
	                        data-bs-toggle="tooltip"
	                        data-bs-placement="right"
	                        data-bs-html="true"
	                        title="Combined safety benefits can exceed the sum of independent bicyclist and pedestrian benefits where evidence suggests an element provides safety benefits for both pedestrians and bicyclists without differentiating by mode"></i>
						</th>
						<td className="text-center">Crashes</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.combined.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.crashes.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.combined.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.crashes.upper)}</td>

					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.combined.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.injuries.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.combined.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.injuries.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.combined.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.deaths.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.combined.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.deaths.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.combined.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.speed.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.combined.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.speed.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.combined.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.yielding.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.combined.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.yielding.upper)}</td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.miles.combined.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.combined.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.combined.crime.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.combined.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.combined.crime.upper)}</td>
					</tr>
				</tbody>
			</table>
			</>
		);
	};
}

export default SafetyQuantitative;
