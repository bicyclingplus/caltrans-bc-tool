import React from 'react';

import { readableNumber } from '../helpers/formatting';

class SafetyQuantative extends React.Component {

	render = () => {

		let { benefits } = this.props;

		return (
			<>
			<h5>4) Safety Benefits – Quantitative</h5>
			<table className="table table-bordered">
				<thead>
					<tr>
						<th></th>
						<th colSpan="3" className="text-center">Benefit</th>
						<th colSpan="3" className="text-center">Benefit / Capita</th>
					</tr>
					<tr>
						<th className="text-center">Parameter</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
					</tr>
				</thead>
				<tbody>
					{
						benefits.map((benefit) => (
							<tr key={benefit.shortname}>
								<td className="text-center">{benefit.label}</td>
								<td className="text-end">{readableNumber(benefit.lower)}</td>
								<td className="text-end">{readableNumber(benefit.mean)}</td>
								<td className="text-end">{readableNumber(benefit.upper)}</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						))
					}
				</tbody>
			</table>
			</>
		);
	};
}

export default SafetyQuantative;
