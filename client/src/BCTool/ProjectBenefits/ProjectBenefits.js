import React from 'react';

import Travel from './Travel';
import SafetyQualitative from './SafetyQualitative';
import SafetyQuantitative from './SafetyQuantitative';
import Emissions from './Emissions';
import Health from './Health';

import { readableNumber } from '../helpers/formatting';

class ProjectBenefits extends React.Component {

  render() {

    let { benefits, name, cost } = this.props;

    return (
      <div className="card">
        <div className="card-body">

            <h4>Project Name: {name}</h4>
            <h4 className="mt-4">Project Cost: ${readableNumber(cost)}</h4>

            {/*<h3 className="card-title text-center">Benefits</h3>*/}

            <Travel benefits={benefits.travel} />

            <h4 className="mt-4">Qualitative Benefits</h4>
            <p>TODO</p>

            <SafetyQualitative benefits={benefits.safetyQualitative} />

            <h4 className="mt-4">Project-Level Quantitative Benefits</h4>

            <SafetyQuantitative benefits={benefits.safetyQuantitative} />

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
