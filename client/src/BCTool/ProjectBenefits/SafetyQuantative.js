import React from 'react';

import { readableNumber } from '../helpers/formatting';

class SafetyQuantative extends React.Component {

	render = () => {

		let { benefits } = this.props;

		return (
			<>
			<h5>4) Safety Benefits – Quantitative</h5>
			<table className="table">
				<thead>
					<tr>
						<th>Parameter</th>
						<th>Lower</th>
						<th>Mean</th>
						<th>Upper</th>
					</tr>
				</thead>
				<tbody>
					{
						benefits.map((benefit) => (
							<tr key={benefit.shortname}>
								<td>{benefit.label}</td>
								<td>{readableNumber(benefit.lower)}</td>
								<td>{readableNumber(benefit.mean)}</td>
								<td>{readableNumber(benefit.upper)}</td>
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
