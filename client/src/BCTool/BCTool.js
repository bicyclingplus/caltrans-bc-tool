import React from 'react';

import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/button';

import './BCTool.css';

import ProjectForm from './ProjectForm/ProjectForm';
import ProjectSummary from './ProjectSummary/ProjectSummary';
import ProjectMap from './ProjectMap/ProjectMap';
import ProjectElements from './ProjectElements/ProjectElements';
import SelectedInfrastructure from './SelectedInfrastructure/SelectedInfrastructure';
import ProjectBenefits from './ProjectBenefits/ProjectBenefits';
import BenefitsButton from './benefits-button';
import ExportButton from './export-button';

import calcDemand from './helpers/calcDemand';
import calcProjectLength from './helpers/calcProjectLength';
import calcBenefits from './helpers/calcBenefits';
import ExportPDF from './helpers/export';

const Modal = require('bootstrap/js/dist/modal');

const counties = require('./data/counties.json');
const infrastructure = require('./data/infrastructure.json');
const non_infrastructure = require('./data/non_infrastructure.json');

class BCTool extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.createDefaultState();
  }

  componentDidMount() {
    this.startModal = new Modal(document.getElementById('bc-tool-start'), {
      backdrop: 'static',
    });

    this.warningModal = new Modal(document.getElementById('bc-tool-warning'), {
      backdrop: 'static',
    });

    this.initProject();
  }

  componentDidUpdate(prevProps) {
    if(this.props.newProject) {
      this.initProject();
    }
  }

  createDefaultState = () => {
    return {
      bounds: [],

      name: '',
      developer: '',
      cost: '',
      type: '',
      subtype: '',
      county: '',
      timeframe: 20,
      year: new Date().getFullYear(),

      length: 0,
      selectedWays: [],
      selectedIntersections: [],
      userWays: [],
      userIntersections: [],
      existingTravel: {},

      non_infrastructure: [],
      non_infrastructure_selected: false,

      selectedInfrastructure: [],
      hasSelectedInfrastructure: false,
      hasMultiSelected: false,

      benefits: {},
      showBenefits: false,
      inputsChanged: false,

      isAddingUserWay: false,
      projectID: '',

    };
  }

  initProject = () => {

    let new_non_infrastructure = [];

    for(let item of non_infrastructure.items) {
      new_non_infrastructure.push({
        label: item.label,
        shortname: item.shortname,
        description: item.description,
        selected: false,
      });
    }

    let newState = this.createDefaultState();

    newState.non_infrastructure = new_non_infrastructure;

    this.setState(newState, () => {
      this.startModal.show();
      this.props.projectStarted();
    });
  }

  componentWillUnmount() {
    this.startModal.dispose();
    this.warningModal.dispose();
  }

  onInfrastructureChange = (shortname, value) => {

    let selectedInfrastructure = structuredClone(this.state.selectedInfrastructure);

    if(value) {
      if(!(shortname in selectedInfrastructure)) {
        selectedInfrastructure[shortname] = {
          new: 0,
          upgrade: 0,
          retrofit: 0,
        }
      }
    }
    else {
      delete selectedInfrastructure[shortname];
    }

    let hasMultiSelected = false;

    outer:
    for(let category of infrastructure.categories) {
      for(let item of category.items) {
        if(item.shortname in selectedInfrastructure && category.shortname === 'multi') {
          hasMultiSelected = true;
          break outer;
        }
      }
    }

    this.setState({
      selectedInfrastructure: selectedInfrastructure,
      hasSelectedInfrastructure: Object.keys(selectedInfrastructure).length > 0,
      hasMultiSelected: hasMultiSelected,
      inputsChanged: true,
    });
  }

  onNonInfrastructureChange = (shortname, value) => {

    const updated = this.state.non_infrastructure;
    let selected = false;

    // Update the changed one
    for(const item of updated) {
      if(item.shortname === shortname) {
        item.selected = value;
        break;
      }
    }

    // Check if any are selected
    for(const item of updated) {
      if(item.selected) {
        selected = true;
        break;
      }
    }

    this.setState({
      non_infrastructure: updated,
      non_infrastructure_selected: selected,
      inputsChanged: true,
    });
  }

  onValueChange = (shortname, type, value) => {

    let selectedInfrastructure = structuredClone(this.state.selectedInfrastructure);

    selectedInfrastructure[shortname][type] = value;

    this.setState({
      selectedInfrastructure: selectedInfrastructure,
      inputsChanged: true,
    });
  };

  exportBenefits = () => {

    let url = `${process.env.PUBLIC_URL}/api/projects`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "details": {
            "name": this.state.name,
            "developer": this.state.developer,
            "county": this.state.county,
            "cost": this.state.cost,
            "time_frame": this.state.timeframe,
            "type": this.state.type,
            "sub_type": this.state.subtype,
            "year": this.state.year,
        },
        "scope": {
            "intersections": this.state.selectedIntersections,
            "segments": this.state.selectedWays,
            "user_intersections": this.state.userIntersections,
            "user_segments": this.state.userWays,
        },
        "selected_elements": {
            "infrastructure": this.state.selectedInfrastructure,
            "non_infrastructure": this.state.non_infrastructure,
        }
      })
    })
      .then((res) => res.json())
      .then(
        (result) => {
            ExportPDF(this.state, result.id);
        },
        (error) => {
          console.log(error);
        },
      );
  }

  updateBenefits = () => {
    this.setState({
      showBenefits: true,
      inputsChanged: false,
      benefits: calcBenefits(
        this.state.type,
        this.state.subtype,
        this.state.county,
        this.state.year,
        this.state.timeframe,
        this.state.length,
        this.state.selectedIntersections.length + this.state.userIntersections.length,
        infrastructure,
        this.state.non_infrastructure,
        this.state.existingTravel,
        this.state.selectedInfrastructure
      ),
    });
  }

  updateName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  updateDeveloper = (e) => {
    this.setState({
      developer: e.target.value,
    });
  };

  updateCost = (e) => {
    this.setState({
      cost: parseFloat(e.target.value),
    });
  };

  updateType = (e) => {
    this.setState({
      type: e.target.value,
      benefits: {},
      showBenefits: false,
      inputsChanged: false,
    });
  };

  updateSubtype = (e) => {
    this.setState({
      subtype: e.target.value,
      benefits: {},
      showBenefits: false,
      inputsChanged: false,
    });
  };

  updateCounty = (e) => {

    let selectedCounty;

    for(let c of counties.counties) {
      if(c.name === e.target.value) {
        selectedCounty = c;
      }
    }

    let bounds = [
      [selectedCounty.ymin, selectedCounty.xmin],
      [selectedCounty.ymax, selectedCounty.xmax],
    ];

    this.setState({
      county: selectedCounty.name,
      bounds: bounds,
    }, () => {
      this.startModal.hide();
    });
  };


  updateMapSelections = (selectedWays, selectedIntersections, userWays, userIntersections) => {

    let projectLength = calcProjectLength(selectedWays, userWays);

    let existingTravel = calcDemand(
      selectedWays,
      userWays,
      selectedIntersections,
      userIntersections,
      projectLength
    );

    this.setState({
      selectedWays: selectedWays,
      selectedIntersections: selectedIntersections,
      userWays: userWays,
      userIntersections: userIntersections,
      length: projectLength,
      existingTravel: existingTravel,
      showBenefits: false,
      inputsChanged: true,
    });
  }

  updateUserWayStatus = (status) => {
    this.setState({
      isAddingUserWay: status,
    });
  }

  showUserWayWarning = () => {
    this.warningModal.show();
  }

  updateTimeFrame = (e) => {
    this.setState({
      timeframe: parseInt(e.target.value),
    });
  };

  updateProjectID = (e) => {
    this.setState({
      projectID: e.target.value,
    });
  };

  loadProject = () => {
    console.log(`Loading project: ${this.state.projectID}`);
    this.startModal.hide();
  };

  render() {
    return (
      <>
      <div className="modal fade" id="bc-tool-start">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="startModalTitle">Welcome to Caltrans' Active Transportation Benefit-Cost Tool</h5>
            </div>
            <div className="modal-body">
              This tool evaluates the costs and benefits of active transportation projects as a part of Caltrans ATP project evaluation.....


              <select id="county" className="form-select mt-4" value={this.state.county} onChange={this.updateCounty}>
                <option value='' disabled>Select County</option>
                {
                  counties.counties.map((county) => (
                    <option key={county.name} value={county.name}>{county.name}</option>
                  ))
                }
              </select>
              <hr />

              <form>
                <div>
                  <label htmlFor="project-id" className="form-label">Project ID</label>
                  <input type="text" className="form-control" id="project-id" value={this.state.projectID} onChange={this.updateProjectID} />
                </div>
                <div>
                  <button type="button" className="btn btn-secondary" onClick={this.loadProject}>Load Project</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" tabIndex="-1" id="bc-tool-warning">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Warning</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>You currently have an unfinished user-defined way. Please finish or cancel this way before proceeding.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">

        <div className="row justify-content-center mb-3 mt-3">
          <div className="col-sm-4">
            <ProjectForm name={this.state.name}
              developer={this.state.developer}
              cost={this.state.cost}
              timeframe={this.state.timeframe}
              type={this.state.type}
              subtype={this.state.subtype}
              updateName={this.updateName}
              updateDeveloper={this.updateDeveloper}
              updateCost={this.updateCost}
              updateType={this.updateType}
              updateSubtype={this.updateSubtype}
              updateTimeFrame={this.updateTimeFrame}
            />
          </div>
          <div className="col-sm-8">
            { this.state.county ?
            <ProjectMap
              bounds={this.state.bounds}
              updateMapSelections={this.updateMapSelections}
              isAddingUserWay={this.state.isAddingUserWay}
              updateUserWayStatus={this.updateUserWayStatus}
              showUserWayWarning={this.showUserWayWarning}
            />
            : null }
          </div>
        </div>
      </div>

      <div className="container">
        { (this.state.type === 'infrastructure' || this.state.type === 'both') && (this.state.selectedIntersections.length || this.state.selectedWays.length || this.state.userWays.length || this.state.userIntersections.length) ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectSummary
              intersections={this.state.selectedIntersections.length+this.state.userIntersections.length}
              length={this.state.length}
              subtype={this.state.subtype}
              travel={this.state.existingTravel} />
          </div>
        </div>
        : null }

        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectElements
              type={this.state.type}
              infrastructure={infrastructure}
              non-infrastructure={this.state.non_infrastructure}
              onInfrastructureChange={this.onInfrastructureChange}
              onNonInfrastructureChange={this.onNonInfrastructureChange}
              isAddingUserWay={this.state.isAddingUserWay}
              showUserWayWarning={this.showUserWayWarning}
              selectedInfrastructure={this.state.selectedInfrastructure}
            />
          </div>
        </div>

        { this.state.hasSelectedInfrastructure ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <SelectedInfrastructure
              categories={infrastructure.categories}
              onValueChange={this.onValueChange}
              multi={this.state.hasMultiSelected}
              selections={this.state.selectedInfrastructure}
            />
          </div>
        </div>
        : null }

        { this.state.hasSelectedInfrastructure || this.state.non_infrastructure_selected ?
        <div className="row mb-3">
          <div className="col-sm-12 text-center">
            <BenefitsButton
              showBenefits={this.state.showBenefits}
              updateBenefits={this.updateBenefits}
              inputsChanged={this.state.inputsChanged}
            />

            <ExportButton
              showBenefits={this.state.showBenefits}
              exportBenefits={this.exportBenefits}
              inputsChanged={this.state.inputsChanged}
            />
          </div>
        </div>
        : null }

        { (this.state.hasSelectedInfrastructure || this.state.non_infrastructure_selected) && this.state.showBenefits ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectBenefits
              benefits={this.state.benefits}
              name={this.state.name}
              cost={this.state.cost}
              timeframe={this.state.timeframe}
              subtype={this.state.subtype}
            />
          </div>
        </div>
        : null }
      </div>
      </>
    );
  }
}

export default BCTool;
