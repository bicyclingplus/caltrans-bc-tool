import React from 'react';

import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/button';

import './BCTool.css';

import ProjectForm from './ProjectForm/ProjectForm';
import ProjectSummary from './ProjectSummary/ProjectSummary';
import ProjectMap from './ProjectMap/ProjectMap';
import ProjectMapForm from './ProjectMap/ProjectMapForm';
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
const nonInfrastructure = require('./data/non_infrastructure.json');

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

      projectID: '',
      name: '',
      developer: '',
      cost: '',
      type: '',
      subtype: '',
      county: '',
      timeframe: 20,
      year: new Date().getFullYear(),
      transit: '',

      initialBounds: [],
      projectBounds: null,
      selectedWays: [],
      selectedIntersections: [],
      userWays: [],
      userIntersections: [],
      totalLength: 0,
      totalIntersections: 0,
      hasMapSelections: false,
      isAddingUserWay: false,
      selection: "way",
      mode: "existing",
      numWaypoints: 0,
      shouldResetMap: false,
      shouldCancelWay: false,
      shouldFinishWay: 0,
      existingTravel: {},

      selectedNonInfrastructure: [],
      hasSelectedNonInfrastructure: false,

      selectedInfrastructure: {},
      hasSelectedInfrastructure: false,
      hasMultiSelected: false,

      benefits: {},
      showBenefits: false,
      inputsChanged: false,
    };
  }

  initProject = () => {
    this.setState(this.createDefaultState(), () => {
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

    this.setState({
      selectedInfrastructure: selectedInfrastructure,
      inputsChanged: true,
    }, () => {
      this.updateStatuses();
    });
  }

  onNonInfrastructureChange = (shortname, value) => {

    let selectedNonInfrastructure = structuredClone(this.state.selectedNonInfrastructure);

    if(value) {
      if(!selectedNonInfrastructure.includes(shortname)) {
        selectedNonInfrastructure.push(shortname);
      }
    }
    else {
      selectedNonInfrastructure = selectedNonInfrastructure.filter(e => e !== shortname);
    }

    this.setState({
      selectedNonInfrastructure: selectedNonInfrastructure,
      inputsChanged: true,
    }, () => {
      this.updateStatuses();
    });
  }

  updateStatuses = () => {
    let hasMultiSelected = false;

    outer:
    for(let category of infrastructure.categories) {
      for(let item of category.items) {
        if(item.shortname in this.state.selectedInfrastructure && category.shortname === 'multi') {
          hasMultiSelected = true;
          break outer;
        }
      }
    }

    this.setState({
      hasSelectedInfrastructure: Object.keys(this.state.selectedInfrastructure).length > 0,
      hasSelectedNonInfrastructure: this.state.selectedNonInfrastructure.length > 0,
      hasMultiSelected: hasMultiSelected,
      showBenefits: Object.keys(this.state.benefits).length > 0,
      hasMapSelections: this.state.selectedIntersections.length || this.state.selectedWays.length || this.state.userWays.length || this.state.userIntersections.length,
    });
  }

  onInfrastructureValueChange = (shortname, type, value) => {

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
        details: {
            name: this.state.name,
            developer: this.state.developer,
            county: this.state.county,
            cost: this.state.cost,
            timeframe: this.state.timeframe,
            type: this.state.type,
            subtype: this.state.subtype,
            year: this.state.year,
            transit: this.state.transit,
        },
        scope: {
            intersections: this.state.selectedIntersections,
            segments: this.state.selectedWays,
            userIntersections: this.state.userIntersections,
            userSegments: this.state.userWays,
            totalLength: this.state.totalLength,
            totalIntersections: this.state.totalIntersections,
            bounds: this.state.projectBounds,
        },
        elements: {
            infrastructure: this.state.selectedInfrastructure,
            nonInfrastructure: this.state.selectedNonInfrastructure,
        },
        existingTravel: this.state.existingTravel,
        benefits: this.state.benefits,
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
      inputsChanged: false,
      benefits: calcBenefits(
        this.state.type,
        this.state.subtype,
        this.state.county,
        this.state.year,
        this.state.timeframe,
        this.state.transit,
        this.state.totalLength,
        this.state.totalIntersections,
        infrastructure,
        this.state.existingTravel,
        this.state.selectedInfrastructure,
        this.state.selectedNonInfrastructure
      ),
    }, this.updateStatuses);
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

    let type = e.target.value;
    let stateUpdate = {
      type: type,
      inputsChanged: true,
    };

    // clear selections that are no longer applicable
    // so they aren't included in benefits calculations
    if(type === 'infrastructure') {
      stateUpdate.hasSelectedNonInfrastructure = false;
      stateUpdate.selectedNonInfrastructure = [];
    }

    if(type === 'non-infrastructure') {
      stateUpdate.hasSelectedInfrastructure = false;
      stateUpdate.selectedInfrastructure = {};
    }

    this.setState(stateUpdate, this.updateStatuses);
  };

  updateSubtype = (e) => {
    this.setState({
      subtype: e.target.value,
      inputsChanged: true,
    }, this.updateStatuses);
  };

  updateTransit = (e) => {
    this.setState({
      transit: e.target.value,
      inputsChanged: true,
    });
  }

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
      initialBounds: bounds,
    }, () => {
      this.startModal.hide();
    });
  };

  updateSelectedWaysAndIntersections = (selectedWays, selectedIntersections) => {
    this.setState({
      selectedWays: selectedWays,
      selectedIntersections: selectedIntersections,
    }, this.updateMapSelections);
  }

  updateUserWaysAndIntersections = (userWays, userIntersections) => {
    this.setState({
      userWays: userWays,
      userIntersections: userIntersections,
    }, this.updateMapSelections);
  }

  updateAllWaysAndIntersections = (selectedWays, selectedIntersections, userWays, userIntersections) => {
    this.setState({
      selectedWays: selectedWays,
      selectedIntersections: selectedIntersections,
      userWays: userWays,
      userIntersections: userIntersections,
    }, this.updateMapSelections);
  }

  updateMapSelections = () => {

    let {
      selectedWays,
      selectedIntersections,
      userWays,
      userIntersections,
    } = this.state;

    let projectLength = calcProjectLength(selectedWays, userWays);

    let existingTravel = calcDemand(
      selectedWays,
      userWays,
      selectedIntersections,
      userIntersections,
      projectLength
    );

    this.setState({
      totalLength: projectLength,
      totalIntersections: selectedIntersections.length + userIntersections.length,
      existingTravel: existingTravel,
      inputsChanged: true,
    }, this.updateStatuses);
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
      inputsChanged: true,
    });
  };

  updateProjectID = (e) => {
    this.setState({
      projectID: e.target.value,
    });
  };

  loadProject = () => {
    // console.log(`Loading project: ${this.state.projectID}`);

    let url = `${process.env.PUBLIC_URL}/api/projects/${this.state.projectID}`;

    fetch(url)
      .then((response) => {
        if(!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(result => {
          this.setState({
            name: result.details.name,
            developer: result.details.developer,
            cost: result.details.cost,
            type: result.details.type,
            subtype: result.details.subtype,
            county: result.details.county,
            timeframe: result.details.timeframe,
            year: result.details.year,
            transit: result.details.transit,

            selectedNonInfrastructure: result.elements.nonInfrastructure,
            selectedInfrastructure: result.elements.infrastructure,

            selectedWays: result.scope.segments,
            selectedIntersections: result.scope.intersections,
            userWays: result.scope.userSegments,
            userIntersections: result.scope.userIntersections,
            totalLength: result.scope.totalLength,
            totalIntersections: result.scope.totalIntersections,
            initialBounds: result.scope.bounds,
            projectBounds: result.scope.bounds,

            existingTravel: result.existingTravel,
            benefits: result.benefits,
          }, () => {
            this.updateStatuses();
            this.startModal.hide();
          });
        }
      )
      .catch(error => {
        console.log('Bad project id');
      });
  };

  updateMapSelectionMode = () => {
    let { selection, isAddingUserWay } = this.state;

    if(selection === 'way' && isAddingUserWay) {
      this.showUserWayWarning();
      return;
    }

    this.setState({
      selection: selection === 'way' ? 'intersection' : 'way',
    });
  };

  updateMapEditingMode = () => {
    let { mode, isAddingUserWay } = this.state;

    if(mode === "add" && isAddingUserWay) {
      this.showUserWayWarning();
      return;
    }

    this.setState({
      mode: mode === 'existing' ? 'add' : 'existing',
    });
  };

  updateNumWaypoints = (num) => {
    this.setState({
      numWaypoints: num,
    })
  };

  resetMap = () => {
    this.setState({
      shouldResetMap: true,
      mode: 'existing',
      selection: 'way',
    })
  }

  mapResetFinished = () => {
    this.setState({
      shouldResetMap: false,
    })
  }

  cancelWay = () => {
    this.setState({
      shouldCancelWay: true,
    })
  }

  cancelWayFinished = () => {
    this.setState({
      shouldCancelWay: false,
    })
  }

  finishOneWay = () => {
    this.setState({
      shouldFinishWay: 1,
    });
  }

  finishTwoWay = () => {
    this.setState({
      shouldFinishWay: 2,
    });
  }

  wayFinished = () => {
    this.setState({
      shouldFinishWay: 0,
    });
  }

  updateProjectBounds = (bounds) => {

    if(bounds.isValid()) {

      this.setState({
        projectBounds: [
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()],
        ],
      });
    }
  };

  render() {
    return (
      <>
      <div className="modal fade" id="bc-tool-start">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="startModalTitle">California Active Transportation Benefit-Cost Tool</h5>
            </div>
            <div className="modal-body">
              <p>This tool has been developed by the UC Davis <a href="https://bicyclingplus.ucdavis.edu/" target="_blank">Bicycling<span className="fst-italic">Plus</span> Research Collaborative</a> to estimate expected benefits of proposed active transportation projects. It can help government agencies, practitioners, and community members understand project-specific cost effectiveness and explore options for improving project design.</p>
              <p>Choose a county below to begin.</p>


              <select id="county" className="form-select mt-4" value={this.state.county} onChange={this.updateCounty}>
                <option value='' disabled>Select County</option>
                {
                  counties.counties.map((county) => (
                    <option key={county.name} value={county.name}>{county.name}</option>
                  ))
                }
              </select>

              <p className="mt-4">Last updated July 5, 2022</p>

              <hr />

              <form>
                <div className="mb-3">
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
              transit={this.state.transit}
              updateName={this.updateName}
              updateDeveloper={this.updateDeveloper}
              updateCost={this.updateCost}
              updateType={this.updateType}
              updateSubtype={this.updateSubtype}
              updateTimeFrame={this.updateTimeFrame}
              updateTransit={this.updateTransit}
            />
            <ProjectMapForm
              selection={this.state.selection}
              changeSelection={this.updateMapSelectionMode}
              mode={this.state.mode}
              changeMode={this.updateMapEditingMode}
              finishOneWay={this.finishOneWay}
              finishTwoWay={this.finishTwoWay}
              cancel={this.cancelWay}
              reset={this.resetMap}
              numWayPoints={this.state.numWaypoints}
            />
          </div>
          <div className="col-sm-8">
            { this.state.county ?
            <ProjectMap
              bounds={this.state.initialBounds}
              updateMapSelections={this.updateMapSelections}
              isAddingUserWay={this.state.isAddingUserWay}
              updateUserWayStatus={this.updateUserWayStatus}
              showUserWayWarning={this.showUserWayWarning}
              selection={this.state.selection}
              mode={this.state.mode}
              updateNumWaypoints={this.updateNumWaypoints}
              shouldResetMap={this.state.shouldResetMap}
              mapResetFinished={this.mapResetFinished}
              shouldCancelWay={this.state.shouldCancelWay}
              cancelWayFinished={this.cancelWayFinished}
              shouldFinishWay={this.state.shouldFinishWay}
              wayFinished={this.wayFinished}
              updateProjectBounds={this.updateProjectBounds}

              selectedWays={this.state.selectedWays}
              selectedIntersections={this.state.selectedIntersections}
              userWays={this.state.userWays}
              userIntersections={this.state.userIntersections}

              updateUserWaysAndIntersections={this.updateUserWaysAndIntersections}
              updateSelectedWaysAndIntersections={this.updateSelectedWaysAndIntersections}
              updateAllWaysAndIntersections={this.updateAllWaysAndIntersections}
            />
            : null }
          </div>
        </div>
      </div>

      <div className="container-fluid">
        { (this.state.type === 'infrastructure' || this.state.type === 'both') && this.state.hasMapSelections ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectSummary
              intersections={this.state.totalIntersections}
              length={this.state.totalLength} />
          </div>
        </div>
        : null }

        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectElements
              type={this.state.type}
              infrastructure={infrastructure}
              nonInfrastructure={nonInfrastructure}
              onInfrastructureChange={this.onInfrastructureChange}
              onNonInfrastructureChange={this.onNonInfrastructureChange}
              isAddingUserWay={this.state.isAddingUserWay}
              showUserWayWarning={this.showUserWayWarning}
              selectedInfrastructure={this.state.selectedInfrastructure}
              selectedNonInfrastructure={this.state.selectedNonInfrastructure}
            />
          </div>
        </div>

        { this.state.hasSelectedInfrastructure ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <SelectedInfrastructure
              categories={infrastructure.categories}
              onChange={this.onInfrastructureValueChange}
              multi={this.state.hasMultiSelected}
              selections={this.state.selectedInfrastructure}
            />
          </div>
        </div>
        : null }

        { this.state.hasSelectedInfrastructure || this.state.hasSelectedNonInfrastructure ?
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

        { (this.state.hasSelectedInfrastructure || this.state.hasSelectedNonInfrastructure) && this.state.showBenefits ?
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
