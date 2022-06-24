import React from 'react';

import CategorizedCheckboxDropdown from './CategorizedCheckboxDropdown';
import CheckboxDropdown from './CheckboxDropdown';

class ProjectElements extends React.Component {

  render() {

    let type = this.props.type;
    let infrastructure = this.props.infrastructure;
    let nonInfrastructure = this.props['non-infrastructure'];

    let onInfrastructureChange = this.props.onInfrastructureChange;
    let onNonInfrastructureChange = this.props.onNonInfrastructureChange;

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-center section-header">Define Project Elements</h4>

          { !type ?
            <div className="mt-4">Select a project type above.</div>
          : null}

          { type === 'infrastructure' || type === 'both' ?
          <div className="row mb-3 mt-4">
            <div className="col-sm-4"><h5 className="form-label">Infrastructure Elements</h5></div>
            <div className="col-sm-8">
              <CategorizedCheckboxDropdown
                id="infrastructure-dropdown"
                className="col-sm-10"
                buttonText="Click to select"
                maxLength="75"
                name="infrastructure"
                categories={infrastructure.categories}
                onChange={onInfrastructureChange}
                isAddingUserWay={this.props.isAddingUserWay}
                showUserWayWarning={this.props.showUserWayWarning}
                />
            </div>
          </div>
          : null }

          { type === 'non-infrastructure' || type === 'both' ?
          <div className="row mb-3">
            <div className="col-sm-4"><h5 className="form-label">Non-Infrastructure Elements</h5></div>
            <div className="col-sm-8">
              <CheckboxDropdown
                id="non-infrastructure-dropdown"
                className="col-sm-10"
                buttonText="Click to select"
                maxLength="75"
                name="non-infrastructure"
                items={nonInfrastructure}
                onChange={onNonInfrastructureChange}
                />
            </div>
          </div>
          : null }

        </div>
      </div>
    );
  }

}

export default ProjectElements;
