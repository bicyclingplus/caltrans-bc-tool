import React from 'react';

import Travel from './Travel';
import SafetyQualitative from './SafetyQualitative';
import SafetyQuantitative from './SafetyQuantitative';
import Emissions from './Emissions';
import Health from './Health';
import ProjectQualitative from './ProjectQualitative';

import { readableNumber } from '../helpers/formatting';

class ProjectBenefits extends React.Component {

  render() {

    let { benefits, name, cost, timeframe } = this.props;

    return (
      <div className="card">
        <div className="card-body">

            <h4>Project Name: {name}</h4>
            <h4 className="mt-4">Project Cost: ${readableNumber(cost)}</h4>

            { benefits.travel ?
            <Travel benefits={benefits.travel} />
            : null }

            { benefits.safetyQuantitative || benefits.emissions || benefits.health ?
            <h4 className="mt-4">Project-Level Quantitative Benefits</h4>
            : null }

            { benefits.safetyQuantitative ?
            <SafetyQuantitative benefits={benefits.safetyQuantitative} />
            : null }

            { benefits.emissions ?
            <Emissions emissions={benefits.emissions} vmtReductions={benefits.vmtReductions} timeframe={timeframe} />
            : null }

            { benefits.health ?
            <Health benefits={benefits.health} />
            : null }

            { benefits.projectQualitative ?
            <ProjectQualitative benefits={benefits.projectQualitative} />
            : null }

            { benefits.safetyQualitative ?
            <SafetyQualitative benefits={benefits.safetyQualitative} />
            : null }


        </div>
      </div>
    );
  }

}

export default ProjectBenefits;
