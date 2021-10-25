import React from 'react';

class ProjectQualitative extends React.Component {

	render = () => {

		let { benefits } = this.props;

		return (
			<>
			<h4 className="mt-4">Qualitative Benefits</h4>
            <table className="table">
            	<thead>
            		<tr>
            			<th>Theme</th>
            			<th>Description</th>
            		</tr>
            	</thead>
            	<tbody>
            	{
            		benefits.map((benefit, idx) => (
            			<tr key={idx}>
	            			<td>{benefit.name}</td>
	            			<td>{benefit.description}</td>
	            		</tr>
            		))
            	}
            	</tbody>
            </table>
			</>
		);
	};
}

export default ProjectQualitative;
