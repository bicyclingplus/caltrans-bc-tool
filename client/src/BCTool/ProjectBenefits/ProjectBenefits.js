import React from 'react';

import Travel from './Travel';
import SafetyQualitative from './SafetyQualitative';
import SafetyQuantitative from './SafetyQuantitative';
import Emissions from './Emissions';
import Health from './Health';
import ProjectQualitative from './ProjectQualitative';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { readableNumber } from '../helpers/formatting';

const Tooltip = require('bootstrap/js/dist/tooltip');

class ProjectBenefits extends React.Component {

  componentDidMount() {
      this.tooltip = new Tooltip(document.getElementById(`project-timeframe-tooltip`));
  }

  componentWillUnmount() {
    if(this.tooltip) {
      this.tooltip.dispose();
    }
  }

  render() {

    let { benefits, name, cost, timeframe, subtype } = this.props;

    return (
      <div className="card">
        <div className="card-body">

            <h4>Project Name: {name}</h4>
            <h4 className="mt-4">Project Cost: ${readableNumber(cost)}</h4>

            { benefits.travel ?
            <Travel benefits={benefits.travel} subtype={subtype} />
            : null }

            { benefits.safetyQuantitative || benefits.emissions || benefits.health ?
            <h4 className="mt-4">
              Project-Level Quantitative Benefits
              <i id={`project-timeframe-tooltip`}
                className="bi bi-info-circle ms-2"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-html="true"
                title={`All benefits calculated at the ${timeframe} year level.`}>
              </i>
            </h4>
            : null }

            { benefits.safetyQuantitative ?
            <SafetyQuantitative benefits={benefits.safetyQuantitative} />
            : null }

            { benefits.emissions ?
            <Emissions emissions={benefits.emissions} vmtReductions={benefits.vmtReductions} timeframe={timeframe} />
            : null }

            { benefits.health ?
            <Health benefits={benefits.health} subtype={subtype} />
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
