import React from 'react';

import DemandIncreaseTable from './DemandIncreaseTable';
import DemandSplitTable from './DemandSplitTable';

class ProjectBenefits extends React.Component {

  render() {

    let benefits = this.props.benefits;

    return (
      <div className="card">
        <div className="card-body">
            <h4 className="card-title text-center">Benefits</h4>

            { Object.keys(benefits['demand-increases']).length ?
            <DemandIncreaseTable benefits={benefits['demand-increases']} />
            : null }

            { Object.keys(benefits['demand-increases']).length ?
            <DemandSplitTable benefits={benefits['demand-splits']} />
            : null }

        </div>
      </div>
    );
  }

}

export default ProjectBenefits;
