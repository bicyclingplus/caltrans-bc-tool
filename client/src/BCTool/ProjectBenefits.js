import React from 'react';

import DemandIncreaseTable from './DemandIncreaseTable';
import DemandSplitTable from './DemandSplitTable';
import VMTReductions from './VMTReductions';

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

            { benefits['demand-splits'].length ?
            <DemandSplitTable benefits={benefits['demand-splits']} />
            : null }

            <VMTReductions benefits={benefits['vmt-reductions']} />

        </div>
      </div>
    );
  }

}

export default ProjectBenefits;
