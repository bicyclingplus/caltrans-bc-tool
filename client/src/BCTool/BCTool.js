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

import calcTravel from './helpers/calcTravel';
import calcVMTReductions from './helpers/calcVMTReductions';
import calcHealth from './helpers/calcHealth';
import calcEmissions from './helpers/calcEmissions';
import calcSafetyQualitative from './helpers/calcSafetyQualitative';
import calcSafetyQuantitative from './helpers/calcSafetyQuantitative';
import calcProjectQualitative from './helpers/calcProjectQualitative';
import calcPedestrianDemand from './helpers/calcPedestrianDemand';
import ExportPDF from './helpers/export';

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

      'length': 0,
      'selectedWays': [],
      'selectedIntersections': [],
      'userWays': [],
      'userIntersections': [],

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

            'selectedWays': [],
            'selectedIntersections': [],
            'userWays': [],
            'userIntersections': [],

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

  exportBenefits = () => {
    ExportPDF(this.state);
  }

  updateBenefits = () => {

    console.log(this.state.infrastructure);

    let projectQualitative = calcProjectQualitative(
      this.state.infrastructure,
      this.state['non-infrastructure'],
    );

    let travel = calcTravel(
      this.state.infrastructure,
      this.state.existingTravel,
      this.state.length
    );

    let vmtReductions = calcVMTReductions(travel);

    let emissions = calcEmissions(
      this.state.county, this.state.year, vmtReductions);

    let health = calcHealth(travel);

    let safetyQualitative = calcSafetyQualitative(this.state.infrastructure);

    let safetyQuantitative = calcSafetyQuantitative(
      this.state.infrastructure,
      travel,
      this.state.length,
      this.state.selectedIntersections.length+this.state.userIntersections.length,
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

    console.log(benefits);

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


  updateMapSelections = (selectedWays, selectedIntersections, userWays, userIntersections) => {

    console.log(`BEGIN PROJECT LENGTH CALCULATION!~~~~~~~~~~`);

    // RECALCULATE PROJECT BIKE/PEDESTRIAN DEMAND AND PROJECT LENGTH

    // keep track of the total project length in feet (user selected + user defined)
    let projectLength = 0;

    // new travel demand object
    let existingTravel = {
      "miles": {
        "bike": {
          'lower': 0,
          'mean': 0,
          'upper': 0,
        },
        "pedestrian": {
          'lower': 0,
          'mean': 0,
          'upper': 0,
        }
      },
      "capita":  {
        "bike": {
          'lower': 0,
          'mean': 0,
          'upper': 0,
        },
        "pedestrian": {
          'lower': 0,
          'mean': 0,
          'upper': 0,
        }
      },
      "jobs":  {
        "bike": {
          'lower': 0,
          'mean': 0,
          'upper': 0,
        },
        "pedestrian": {
          'lower': 0,
          'mean': 0,
          'upper': 0,
        }
      },
    };

    // CALCULATE BIKE DEMAND

    // AVERAGE NEEDED PROPERTIES FOR USER SELECTED WAYS
    // Avg lower/mean/upper used for user defined ways
    // Avg pops/jobs used for user selected ways that are missing
    // these properties as well as user defined ways
    let wayLower = [];
    let wayAvg = [];
    let wayUpper = [];
    let wayPops = [];
    let wayJobs = [];

    for(let way of selectedWays) {
      if(way.properties.low_daily) {
        wayLower.push(parseInt(way.properties.low_daily));
      }
      if(way.properties.Avg_daily) {
        wayAvg.push(parseInt(way.properties.Avg_daily));
      }
      if(way.properties.high_daily) {
        wayUpper.push(parseInt(way.properties.high_daily));
      }
      if(way.properties.Jobs) {
        wayJobs.push(way.properties.Jobs);
      }
      if(way.properties.population) {
        wayPops.push(way.properties.population);
      }
    }

    let avgWayLower = wayLower.length ? wayLower.reduce((a,b) => a+b) / wayLower.length : null;
    let avgWayAvg = wayAvg.length ? wayAvg.reduce((a,b) => a+b) / wayAvg.length : null;
    let avgWayUpper = wayUpper.length ? wayUpper.reduce((a,b) => a+b) / wayUpper.length : null;
    let avgWayPop = wayPops.length ? wayPops.reduce((a,b) => a+b) / wayPops.length : null;
    let avgWayJobs = wayPops.length ? wayJobs.reduce((a,b) => a+b) / wayJobs.length : null;

    // Array of demand objects per user selected or user defined way
    let waysTravel = [];

    // CALCULATE BIKE DEMAND PER USER SELECTED WAY
    for(let way of selectedWays) {

      let current = {
        'miles': {},
        'capita': {},
        'jobs': {},
      };

      let lower = parseInt(way.properties.low_daily);
      let mean = parseInt(way.properties.Avg_daily);
      let upper = parseInt(way.properties.high_daily);

      // use properties for this way or the average of all selected ways if missing
      let population = way.properties.population ? way.properties.population : avgWayPop;
      let jobs = way.properties.Jobs ? way.properties.Jobs : avgWayJobs;

      // demand calcs all based on miles so convert feet -> miles here
      let wayLengthMiles = way.properties.length / 5280;

      current.miles.lower = lower * wayLengthMiles;
      current.miles.mean = mean * wayLengthMiles;
      current.miles.upper = upper * wayLengthMiles;

      // divide by population for per capita
      current.capita.lower = current.miles.lower / population;
      current.capita.mean = current.miles.mean / population;
      current.capita.upper = current.miles.upper / population;

      // divide by jobs for per jobs
      current.jobs.lower = current.miles.lower / jobs;
      current.jobs.mean = current.miles.mean / jobs;
      current.jobs.upper = current.miles.upper / jobs;

      waysTravel.push(current);
      projectLength += way.properties.length;
      console.log(`Adding selected way with length of ${way.properties.length}, total project length: ${projectLength}`);
    }

    // CALCULATE BIKE DEMAND PER USER DEFINED WAY
    for(let way of userWays) {

      let current = {
        'miles': {},
        'capita': {},
        'jobs': {},
      };

      // demand calcs all based on miles so convert feet -> miles here
      let wayLengthMiles = way.properties.length / 5280;

      // use averages for everything here because user defined ways
      // won't have any of these properties
      current.miles.lower = avgWayLower * wayLengthMiles;
      current.miles.mean = avgWayAvg * wayLengthMiles;
      current.miles.upper = avgWayUpper * wayLengthMiles;

      current.capita.lower = current.miles.lower / avgWayPop;
      current.capita.mean = current.miles.mean / avgWayPop;
      current.capita.upper = current.miles.upper / avgWayPop;

      current.jobs.lower = current.miles.lower / avgWayJobs;
      current.jobs.mean = current.miles.mean / avgWayJobs;
      current.jobs.upper = current.miles.upper / avgWayJobs;

      waysTravel.push(current);
      projectLength += way.properties.length;
      console.log(`Adding defined way with length of ${way.properties.length}, total project length: ${projectLength}`);
    }

    // grab total bike demand by summing all ways
    for(let travel of waysTravel) {
      existingTravel.miles.bike.lower += travel.miles.lower;
      existingTravel.miles.bike.mean += travel.miles.mean;
      existingTravel.miles.bike.upper += travel.miles.upper;

      existingTravel.capita.bike.lower += travel.capita.lower;
      existingTravel.capita.bike.mean += travel.capita.mean;
      existingTravel.capita.bike.upper += travel.capita.upper;

      existingTravel.jobs.bike.lower += travel.jobs.lower;
      existingTravel.jobs.bike.mean += travel.jobs.mean;
      existingTravel.jobs.bike.upper += travel.jobs.upper;
    }

    // CALCULATED PEDESTRIAN DEMAND


    // Grab the averages
    // Avg lower/mean/upper/pops/jobs used for user defined intersections
    let intersectionLower = [];
    let intersectionAvg = [];
    let intersectionUpper = [];
    let intersectionPops = [];
    let intersectionJobs = [];

    for(let intersection of selectedIntersections) {
      if(intersection.properties.low_pred) {
        intersectionLower.push(parseInt(intersection.properties.low_pred));
      }
      if(intersection.properties.avg_pred) {
        intersectionAvg.push(parseInt(intersection.properties.avg_pred));
      }
      if(intersection.properties.high_pred) {
        intersectionUpper.push(parseInt(intersection.properties.high_pred));
      }
      if(intersection.properties.population) {
        intersectionPops.push(parseInt(intersection.properties.population));
      }
      if(intersection.properties.Jobs) {
        intersectionJobs.push(parseInt(intersection.properties.Jobs));
      }
    }

    let avgIntersectionLower = intersectionLower.length ? intersectionLower.reduce((a,b) => a+b) / intersectionLower.length : null;
    let avgIntersectionAvg = intersectionAvg.length ? intersectionAvg.reduce((a,b) => a+b) / intersectionAvg.length : null;
    let avgIntersectionUpper = intersectionUpper.length ? intersectionUpper.reduce((a,b) => a+b) / intersectionUpper.length : null;
    let avgIntersectionPops = intersectionPops.length ? intersectionPops.reduce((a,b) => a+b) / intersectionPops.length : null;
    let avgIntersectionJobs = intersectionJobs.length ? intersectionJobs.reduce((a,b) => a+b) / intersectionJobs.length : null;


    // CALCULATE PEDESTRIAN DEMAND FOR USER SELECTED INTERSECTIONS
    // each selected intersection has some prediction of pedestrian demand,
    // we add these to the total here
    for(let intersection of selectedIntersections) {

      let lower = parseInt(intersection.properties.low_pred);
      let mean = parseInt(intersection.properties.avg_pred);
      let upper = parseInt(intersection.properties.high_pred);
      let population = intersection.properties.population;
      let jobs = intersection.properties.Jobs;

      existingTravel.miles.pedestrian.lower += lower;
      existingTravel.miles.pedestrian.mean += mean;
      existingTravel.miles.pedestrian.upper += upper;

      existingTravel.capita.pedestrian.lower += lower / population;
      existingTravel.capita.pedestrian.mean += mean / population;
      existingTravel.capita.pedestrian.upper += upper / population;

      existingTravel.jobs.pedestrian.lower += lower / jobs;
      existingTravel.jobs.pedestrian.mean += mean / jobs;
      existingTravel.jobs.pedestrian.upper += upper / jobs;

    }

    // CALCULATE PEDESTRIAN DEMAND FOR USER DEFINED INTERSECTIONS
    // user defined intersections won't have the necessary properties, so we use averages
    // since they're all the same no need to loop through, just multiply by the
    // number of user defined intersections
    existingTravel.miles.pedestrian.lower += avgIntersectionLower * userIntersections.length;
    existingTravel.miles.pedestrian.mean += avgIntersectionAvg * userIntersections.length;
    existingTravel.miles.pedestrian.upper += avgIntersectionUpper * userIntersections.length;

    existingTravel.capita.pedestrian.lower += (avgIntersectionLower * userIntersections.length) / avgIntersectionPops;
    existingTravel.capita.pedestrian.mean += (avgIntersectionAvg * userIntersections.length) / avgIntersectionPops;
    existingTravel.capita.pedestrian.upper += (avgIntersectionUpper * userIntersections.length) / avgIntersectionPops;

    existingTravel.jobs.pedestrian.lower += (avgIntersectionLower * userIntersections.length) / avgIntersectionJobs;
    existingTravel.jobs.pedestrian.mean += (avgIntersectionAvg * userIntersections.length) / avgIntersectionJobs;
    existingTravel.jobs.pedestrian.upper += (avgIntersectionUpper * userIntersections.length) / avgIntersectionJobs;

    // then the pedestrian demand is weighted by the project length and
    // number of intersections
    let projectLengthMiles = projectLength / 5280;
    let numIntersections = selectedIntersections.length + userIntersections.length;

    if(numIntersections > 0) {

      existingTravel.miles.pedestrian.lower = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.miles.pedestrian.lower);
      existingTravel.miles.pedestrian.mean = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.miles.pedestrian.mean);
      existingTravel.miles.pedestrian.upper = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.miles.pedestrian.upper);

      existingTravel.capita.pedestrian.lower = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.capita.pedestrian.lower);
      existingTravel.capita.pedestrian.mean = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.capita.pedestrian.mean);
      existingTravel.capita.pedestrian.upper = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.capita.pedestrian.upper);

      existingTravel.jobs.pedestrian.lower = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.jobs.pedestrian.lower);
      existingTravel.jobs.pedestrian.mean = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.jobs.pedestrian.mean);
      existingTravel.jobs.pedestrian.upper = calcPedestrianDemand(projectLengthMiles, numIntersections, existingTravel.jobs.pedestrian.upper);
    }

    // console.log(existingTravel);

    this.setState({
      'existingTravel': existingTravel,
      'selectedWays': selectedWays,
      'selectedIntersections': selectedIntersections,
      'userWays': userWays,
      'userIntersections': userIntersections,
      'length': projectLength,
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

        { this.state['interactive-map'] ?
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

        { this.state['type'] === 'infrastructure' && (this.state.selectedIntersections.length || this.state.selectedWays.length || this.state.userWays.length || this.state.userIntersections.length) ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectSummary
              intersections={this.state.selectedIntersections.length+this.state.userIntersections.length}
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

            <ExportButton
              showBenefits={this.state.showBenefits}
              exportBenefits={this.exportBenefits}
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
              subtype={this.state.subtype}
            />
          </div>
        </div>
        : null }
      </div>
    );
  }
}

export default BCTool;
