import React from 'react';

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
							<tr>
								<th>{benefit.parameter}</th>
								<th>{benefit.lower}</th>
								<th>{benefit.mean}</th>
								<th>{benefit.upper}</th>
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
