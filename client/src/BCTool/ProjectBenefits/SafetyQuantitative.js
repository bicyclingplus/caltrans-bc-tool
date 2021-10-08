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
						<td className="text-end">{readableNumber(benefits.crashes.lower)}</td>
						<td className="text-end">{readableNumber(benefits.crashes.mean)}</td>
						<td className="text-end">{readableNumber(benefits.crashes.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Injuries</td>
						<td className="text-end">{readableNumber(benefits.injuries.lower)}</td>
						<td className="text-end">{readableNumber(benefits.injuries.mean)}</td>
						<td className="text-end">{readableNumber(benefits.injuries.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr style={{"border-bottom-width": "thick", "border-bottom-color": "grey"}}>
						<td className="text-center">Deaths</td>
						<td className="text-end">{readableNumber(benefits.deaths.lower)}</td>
						<td className="text-end">{readableNumber(benefits.deaths.mean)}</td>
						<td className="text-end">{readableNumber(benefits.deaths.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Speed</td>
						<td className="text-end">{readableNumber(benefits.speed.lower)}</td>
						<td className="text-end">{readableNumber(benefits.speed.mean)}</td>
						<td className="text-end">{readableNumber(benefits.speed.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Yielding</td>
						<td className="text-end">{readableNumber(benefits.yielding.lower)}</td>
						<td className="text-end">{readableNumber(benefits.yielding.mean)}</td>
						<td className="text-end">{readableNumber(benefits.yielding.upper)}</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td className="text-center">Crime</td>
						<td className="text-end">{readableNumber(benefits.crime.lower)}</td>
						<td className="text-end">{readableNumber(benefits.crime.mean)}</td>
						<td className="text-end">{readableNumber(benefits.crime.upper)}</td>
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
