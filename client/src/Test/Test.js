import React from 'react';

function Test(props) {

	let { newProject, projectStarted } = props;

	return(
		<>
		<h1>Test</h1>
		<p>Start new project? {newProject ? "Yes" : "No"} <button onClick={projectStarted}>Started!</button></p>
		</>
	);
}

export default Test;
