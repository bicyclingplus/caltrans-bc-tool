import React from 'react';

import Demand from './Demand';
import SafetyQualitative from './SafetyQualitative';
import SafetyQuantative from './SafetyQuantative';
import Emissions from './Emissions';
import Health from './Health';

class ProjectBenefits extends React.Component {

  render() {

    let benefits = this.props.benefits;

    return (
      <div className="card">
        <div className="card-body">
            <h4 className="card-title text-center">Benefits</h4>

            <Demand benefits={benefits.demand} />

            <SafetyQualitative benefits={benefits.safetyQualitative} />

            <SafetyQuantative benefits={benefits.safetyQuantitative} />

            { benefits.emissions ?
            <Emissions emissions={benefits.emissions} vmtReductions={benefits.vmtReductions} />
            : null }

            <Health benefits={benefits.health} />

        </div>
      </div>
    );
  }

}

export default ProjectBenefits;
