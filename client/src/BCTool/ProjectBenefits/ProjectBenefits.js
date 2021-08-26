import React from 'react';

import DemandIncreaseTable from './DemandIncreaseTable';
import DemandSplitTable from './DemandSplitTable';
import VMTReductions from './VMTReductions';
import EmissionBenefits from './EmissionBenefits';
import HealthBenefits from './HealthBenefits';

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

            <EmissionBenefits benefits={benefits['emissions']} />

            { benefits['health'].length ?
            <HealthBenefits benefits={benefits['health']} />
            : null }

        </div>
      </div>
    );
  }

}

export default ProjectBenefits;
