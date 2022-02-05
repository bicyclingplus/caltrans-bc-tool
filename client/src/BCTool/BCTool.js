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

import calcTravel from './helpers/calcTravel';
import calcVMTReductions from './helpers/calcVMTReductions';
import calcHealth from './helpers/calcHealth';
import calcEmissions from './helpers/calcEmissions';
import calcSafetyQualitative from './helpers/calcSafetyQualitative';
import calcSafetyQuantitative from './helpers/calcSafetyQuantitative';
import calcProjectQualitative from './helpers/calcProjectQualitative';
import calcPedestrianDemand from './helpers/calcPedestrianDemand';

const infrastructure = require('./data/infrastructure.json');
const non_infrastructure = require('./data/non_infrastructure.json');

class BCTool extends React.Component {

  constructor(props) {
    super(props);

    this.map = null;
    this.features = null;

    this.state = {
      'existing-projects': [],
      'selected-project': '',

      'name': '',
      'developer': '',
      'cost': '',
      'type': '',
      'subtype': '',
      'city': '',
      'county': '',
      'year': '',
      'timeframe': 1,

      'intersections': 0,
      'length': 0,

      'selectedWays': [],
      'selectedIntersections': [],

      'osm-ids': [],
      'existingTravel': {},

      'infrastructure': [],
      'non-infrastructure': [],
      'infrastructure-selected': false,
      'multi-selected': false,
      'non-infrastructure-selected': false,

      'benefits': {},
      'showBenefits': false,
      'inputsChanged': false,

      "interactive-map": false,
      "center": [],
    };

    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.onInfrastructureChange = this.onInfrastructureChange.bind(this);
    this.onNonInfrastructureChange = this.onNonInfrastructureChange.bind(this);

  }

  componentDidMount() {

    fetch(`${process.env.PUBLIC_URL}/api/existing`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            'existing-projects': result,
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  handleProjectChange(e) {

    let project;

    for(let i = 0; i < this.state['existing-projects'].length; i++) {
      if(this.state['existing-projects'][i]['id'] === parseInt(e.target.value)) {
        project = this.state['existing-projects'][i];
      }
    }

    // Use project config to preselect some items and prefill their counts
    let preselected = Object.keys(project.infrastructure);

    for(let category in infrastructure.categories) {

      for(let item of infrastructure.categories[category].items) {

        let type = preselected.includes(item.shortname) ? project.infrastructure[item.shortname].type : '';
        let value = preselected.includes(item.shortname) ? project.infrastructure[item.shortname].value : 0;

        item.selected = preselected.includes(item.shortname);
        item.value = value;
        item.type = type;
      }
    }

    let new_non_infrastructure = [];

    for(let item of non_infrastructure.items) {
      new_non_infrastructure.push({
        "label": item.label,
        "shortname": item.shortname,
        "description": item.description,
        "selected": project['non-infrastructure'].includes(item.shortname),
      });
    }

    fetch(`${process.env.PUBLIC_URL}/api/geojson/${e.target.value}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.geojson = result;

          this.setState({
            'selected-project': e.target.value,

            'name': project['name'],
            'developer': project['developer'],
            'cost': project['cost'],
            'type': project['type'],
            'subtype': project['subtype'],
            'city': project['city'],
            'county': project['county'],
            'year': project['year'],

            'intersections': project['intersections'] ? project['intersections'] : 0,
            'length': project['length'] ? project['length'] : 0,

            'selectedWays': [],
            'selectedIntersections': [],

            'existingTravel': project['existingTravel'],
            'osm-ids': project['osm-ids'],

            'infrastructure': infrastructure,
            'non-infrastructure': new_non_infrastructure,
            'infrastructure-selected': preselected.length ? true : false,
            'non-infrastructure-selected': new_non_infrastructure.length ? true : false,

            'benefits': {},
            'showBenefits': false,
            'inputsChanged': false,

            "interactive-map": project['interactive-map'],
            "center": project.center,
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  onInfrastructureChange(changedCategory, changedItem, value) {

    let updated = this.state.infrastructure;
    let selected = false;
    let multi = false;

    // Update the changed one
    outer:
    for(let category of updated.categories) {

      if(category.shortname === changedCategory) {

        for(let item of category.items) {

          if(item.shortname === changedItem) {

            item.selected = value;
            break outer;
          }
        }
      }
    }

    // Check if any are selected
    for(let category of updated.categories) {

      for(let item of category.items) {

        if(item.selected) {
          selected = true;

          if(category.shortname === 'multi') {
            multi = true;
          }
        }
      }
    }

    this.setState({
      'infrastructure': updated,
      'infrastructure-selected': selected,
      'multi-selected': multi,
      'inputsChanged': true,
    });
  }

  onNonInfrastructureChange(shortname, value) {

    const updated = this.state['non-infrastructure'];
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
      'non-infrastructure': updated,
      'non-infrastructure-selected': selected,
      'inputsChanged': true,
    });
  }

  onValueChange = (shortname, value) => {

    // console.log(`Item ${shortname} changed to ${value}`);

    let updated = this.state.infrastructure;

    outer:
    for(let category of updated.categories) {

      for(let item of category.items) {

        if(item.shortname === shortname) {
          item.value = value;
          break outer;
        }
      }
    }

    this.setState({
      'infrastructure': updated,
      'inputsChanged': true,
    })

  };

  onTypeChange = (shortname, value) => {

    let updated = this.state.infrastructure;

    outer:
    for(let category of updated.categories) {

      for(let item of category.items) {

        if(item.shortname === shortname) {
          item.type = value;
          break outer;
        }
      }
    }

    this.setState({
      'infrastructure': updated,
      'inputsChanged': true,
    });
  }

  updateBenefits = () => {

    let projectQualitative = calcProjectQualitative(
      this.state.infrastructure,
      this.state['non-infrastructure'],
    );

    let travel = calcTravel(
      this.state.infrastructure,
      this.state.subtype,
      this.state.existingTravel,
      this.state.length
    );

    let vmtReductions = calcVMTReductions(travel);

    let emissions = calcEmissions(
      this.state.county, this.state.year, vmtReductions);

    let health = calcHealth(this.state.subtype, travel);

    let safetyQualitative = calcSafetyQualitative(this.state.infrastructure);

    let safetyQuantitative = calcSafetyQuantitative(
      this.state.infrastructure,
      travel,
      this.state.length,
      this.state.intersections,
      this.state.subtype);

    let benefits = {
      'projectQualitative': projectQualitative,
    };

    if(this.state.type !== 'non-infrastructure') {
      benefits.travel = travel;
      benefits.vmtReductions = vmtReductions;
      benefits.emissions = emissions;
      benefits.health = health;
      benefits.safetyQualitative = safetyQualitative;
      benefits.safetyQuantitative = safetyQuantitative;
    }

    // console.log(benefits);

    this.setState({
      'showBenefits': true,
      'inputsChanged': false,
      'benefits': benefits,
    });

  }

  updateName = (e) => {
    this.setState({
      'name': e.target.value,
    });
  };

  updateDeveloper = (e) => {
    this.setState({
      'developer': e.target.value,
    });
  };

  updateCost = (e) => {
    this.setState({
      'cost': e.target.value,
    });
  };

  updateType = (e) => {
    this.setState({
      'type': e.target.value,
      'benefits': {},
      'showBenefits': false,
      'inputsChanged': false,
    });
  };

  updateSubtype = (e) => {
    this.setState({
      'subtype': e.target.value,
      'benefits': {},
      'showBenefits': false,
      'inputsChanged': false,
    });
  };

  updateCounty = (e) => {
    this.setState({
      'county': e.target.value,
      'benefits': {},
      'showBenefits': false,
      'inputsChanged': false,
    });
  };


  updateMapSelections = (selectedWays, selectedIntersections, length) => {
    let existingTravel = { ...this.state.existingTravel};

    // update bike demand
    // there is some model for demand and each way has lower/mean/upper
    // values for bike demand.
    // we simply total these numbers for all the selected ways
    let bikeDemandLower = 0, bikeDemandMean = 0, bikeDemandUpper = 0;

    for(let way of selectedWays) {

      let lower = parseInt(way.properties.low_daily);
      let mean = parseInt(way.properties.Avg_daily);
      let upper = parseInt(way.properties.high_daily);

      if(lower) {
        bikeDemandLower += lower;
      }

      if(mean) {
        bikeDemandMean += mean;
      }

      if(upper) {
        bikeDemandUpper += upper;
      }
    }

    if(existingTravel.bike.lower !== null) {
      existingTravel.bike.lower = bikeDemandLower;
    }

    if(existingTravel.bike.mean !== null) {
      existingTravel.bike.mean = bikeDemandMean;
    }

    if(existingTravel.bike.upper !== null) {
      existingTravel.bike.upper = bikeDemandUpper;
    }

    // update ped demand
    // each selected intersection has some prediction of pedestrian demand,
    // we total these up here.
    // then the demand is weighted by the project length and
    // number of intersections
    let pedTotalLower = 0,
        pedTotalMean = 0,
        pedTotalUpper = 0;

    for(let intersection of selectedIntersections) {
      let lower = parseInt(intersection.properties.low_pred);
      let mean = parseInt(intersection.properties.avg_pred);
      let upper = parseInt(intersection.properties.high_pred);

      if(lower) {
        pedTotalLower += lower;
      }

      if(mean) {
        pedTotalMean += mean;
      }

      if(upper) {
        pedTotalUpper += upper;
      }
    }

    let pedDemandLower = calcPedestrianDemand(length, selectedIntersections.length, pedTotalLower);
    let pedDemandMean = calcPedestrianDemand(length, selectedIntersections.length, pedTotalMean);
    let pedDemandUpper = calcPedestrianDemand(length, selectedIntersections.length, pedTotalUpper);

    if(existingTravel.pedestrian.lower !== null) {
      existingTravel.pedestrian.lower = pedDemandLower ? pedDemandLower : 0;
    }

    if(existingTravel.pedestrian.mean !== null) {
      existingTravel.pedestrian.mean = pedDemandMean ? pedDemandMean : 0;
    }

    if(existingTravel.pedestrian.upper !== null) {
      existingTravel.pedestrian.upper = pedDemandUpper ? pedDemandUpper : 0;
    }

    this.setState({
      'existingTravel': existingTravel,
      'selectedWays': selectedWays,
      'selectedIntersections': selectedIntersections,
      'intersections': selectedIntersections.length,
      'length': length,
      'showBenefits': false,
      'inputsChanged': true,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center mb-3">
          <div className="col-sm-8 mt-4">
            <form>
              <div className="row">
                <label htmlFor="existing-project" className="col-sm-2 col-form-label text-end">Existing Project</label>
                <div className="col-md-10">
                  <select id="existing-project" className="form-select" onChange={this.handleProjectChange} defaultValue="">
                    <option value="" disabled>-- Select a project --</option>
                    {this.state['existing-projects'].map((project) => <option key={project['id']} value={project['id']}>{project['name']}</option>)}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row justify-content-center mb-3">
          <div className="col-sm-8">
            <ProjectForm name={this.state['name']}
              developer={this.state['developer']}
              cost={this.state['cost']}
              timeframe={this.state.timeframe}
              type={this.state['type']}
              subtype={this.state['subtype']}
              county={this.state['county']}
              updateName={this.updateName}
              updateDeveloper={this.updateDeveloper}
              updateCost={this.updateCost}
              updateType={this.updateType}
              updateSubtype={this.updateSubtype}
              updateCounty={this.updateCounty}
            />
          </div>
        </div>

        { this.state['selected-project'] ?
        <>

        { this.state['osm-ids'].length || this.state['interactive-map'] ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectMap
              geojson={this.geojson}
              interactive={this.state['interactive-map']}
              center={this.state.center}
              updateMapSelections={this.updateMapSelections}
            />
          </div>
        </div>
        : null }

        { this.state['type'] === 'infrastructure' ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectSummary
              intersections={this.state.intersections}
              length={this.state.length}
              subtype={this.state['subtype']}
              travel={this.state.existingTravel} />
          </div>
        </div>
        : null }

        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectElements
              type={this.state.type}
              infrastructure={this.state.infrastructure}
              non-infrastructure={this.state['non-infrastructure']}
              onInfrastructureChange={this.onInfrastructureChange}
              onNonInfrastructureChange={this.onNonInfrastructureChange}
            />
          </div>
        </div>
        </>
        : null }

        { this.state['infrastructure-selected'] ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <SelectedInfrastructure
              categories={this.state.infrastructure.categories}
              onValueChange={this.onValueChange}
              onTypeChange={this.onTypeChange}
              multi={this.state['multi-selected']}
            />
          </div>
        </div>
        : null }

        { this.state['infrastructure-selected'] || this.state['non-infrastructure-selected'] ?
        <div className="row mb-3">
          <div className="col-sm-12 text-center">
            <BenefitsButton
              showBenefits={this.state.showBenefits}
              updateBenefits={this.updateBenefits}
              inputsChanged={this.state.inputsChanged}
            />
          </div>
        </div>
        : null }

        { (this.state['infrastructure-selected'] || this.state['non-infrastructure-selected']) && this.state.showBenefits ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectBenefits
              benefits={this.state.benefits}
              name={this.state.name}
              cost={this.state.cost}
              timeframe={this.state.timeframe}
            />
          </div>
        </div>
        : null }
      </div>
    );
  }
}

export default BCTool;
