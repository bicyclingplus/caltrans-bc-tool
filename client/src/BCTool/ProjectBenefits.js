import React from 'react';

import DemandIncreaseTable from './DemandIncreaseTable';

class ProjectBenefits extends React.Component {

  render() {

    let benefits = this.props.benefits;

    return (
      <div className="card">
        <div className="card-body">
            <h4 className="card-title text-center">Benefits</h4>

            <DemandIncreaseTable benefits={benefits['demand-increases']} />
        </div>
      </div>
    );
  }

}

export default ProjectBenefits;
