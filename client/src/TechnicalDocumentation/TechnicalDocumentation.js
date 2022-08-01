import React from 'react';

function TechnicalDocumentation(props) {


	return(
		<embed src={`${process.env.PUBLIC_URL}/Caltrans ATP BC Tool Technical Documentation Final Draft.pdf`} width="100%" height="800px" />
	);
}

export default TechnicalDocumentation;
