import React from 'react';

// props needed

// selection
// changeSelection
// mode
// changeMode
// finish
// cancel
// reset
// numWayPoints

class ProjectMapForm extends React.Component {

    changeSelectionWay = () => {

    	let { selection, changeSelection } = this.props;

    	if(selection !== 'way') {
    		changeSelection();
    	}
    };

    changeSelectionIntersection = () => {

    	let { selection, changeSelection } = this.props;

    	if(selection !== 'intersection') {
    		changeSelection();
    	}
    };

    changeModeAdd = () => {
    	let { mode, changeMode } = this.props;

    	if(mode !== 'add') {
    		changeMode();
    	}
    }

    changeModeExisting = () => {
    	let { mode, changeMode } = this.props;

    	if(mode !== 'existing') {
    		changeMode();
    	}
    }

    render() {

      let {
      	mode,
      	selection,
      	numWayPoints,

      	reset,
      	cancel,
      	finishOneWay,
      	finishTwoWay,
      } = this.props;

      let existingClasses = mode === 'existing' ? `btn btn-existing` : `btn btn-outline-existing`;
      let addClasses = mode === 'add' ? `btn btn-user-defined active` : `btn btn-outline-user-defined`;

      let wayClasses = selection === 'way' ? `btn btn-secondary active` : `btn btn-outline-secondary`;
      let intersectionClasses = selection === 'intersection' ? `btn btn-secondary active` : `btn btn-outline-secondary`;

      return (
        <div className="row mb-4">
          <div className="mb-4">
            <strong>Selecting on map:</strong>
            <div className="btn-group ms-4" role="group" aria-label="Basic example">
              <button type="button" className={wayClasses} onClick={this.changeSelectionWay}>Segments</button>
              <button type="button" className={intersectionClasses} onClick={this.changeSelectionIntersection}>Intersections</button>
            </div>

            <button type="button" className="btn btn-outline-secondary ms-4" onClick={reset}>Reset Map</button>
          </div>

          <div className="mb-4">

            <strong>Editing mode:</strong>
            <div className="btn-group ms-4" role="group" aria-label="Basic example">
              <button type="button" className={existingClasses} onClick={this.changeModeExisting}>Selecting Existing</button>
              <button type="button" className={addClasses} onClick={this.changeModeAdd}>Add User Defined</button>
            </div>
          </div>

			{ mode === "add" && selection === "way" && numWayPoints > 0 ?
			<>
				{ numWayPoints > 1 ?
				<>
				<div className="mb-4">
					<button type="button" className="btn btn-user-defined ms-4" onClick={finishTwoWay}>Add as two way segment</button>
					<button type="button" className="btn btn-user-defined ms-4" onClick={finishOneWay}>Add as one way segment</button>
				</div>
				</>
				: null }

			<div className="mb-4">
				<button type="button" className="btn btn-outline-user-defined ms-4" onClick={cancel}>Cancel Adding Segment</button>
			</div>
			</>
			: null }
        </div>
      );
    }

}

export default ProjectMapForm;