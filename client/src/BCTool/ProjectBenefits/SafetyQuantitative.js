import React from 'react';

import { readableNumber } from '../helpers/formatting';

class SafetyQuantitative extends React.Component {

	render = () => {

		let { benefits } = this.props;

		return (
			<>
			<h5 className="mt-4">Safety</h5>
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
