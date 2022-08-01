import React from 'react';

function UserGuide(props) {


	return(
		<embed src={`${process.env.PUBLIC_URL}/User Guide.pdf`} width="100%" height="800px" />
	);
}

export default UserGuide;
