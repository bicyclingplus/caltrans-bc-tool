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

import calcDemandIncreases from './helpers/calcDemandIncreases';
import calcDemandSplits from './helpers/calcDemandSplits';
import calcVMTReductions from './helpers/calcVMTReductions';
import calcHealthBenefits from './helpers/calcHealthBenefits';
import calcEmissionBenefits from './helpers/calcEmissionBenefits';

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

      'osm-ids': [],
      'demand': {},

      'infrastructure': [],
      'non-infrastructure': [],
      'infrastructure-selected': false,
      'non-infrastructure-selected': false,

      'showBenefits': false,
    };

    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.onInfrastructureChange = this.onInfrastructureChange.bind(this);
    this.onNonInfrastructureChange = this.onNonInfrastructureChange.bind(this);
    this.handleBenefitButton = this.handleBenefitButton.bind(this);

  }

  componentDidMount() {

    fetch('/api/existing')
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

    console.log(project);
    let preselected = Object.keys(project.infrastructure);
    let new_infrastructure = [];

    for(let category in infrastructure['items']) {

      new_infrastructure[category] = [];

      let current = infrastructure['items'][category];

      for(let i = 0; i < current.length; i++) {
        new_infrastructure[category].push({
          "label": current[i]['label'],
          "shortname": current[i]['shortname'],
          "description": current[i]['description'],
          "selected": preselected.includes(current[i]['shortname']),
          "count": project.infrastructure[current[i]['shortname']],
        });
      }
    }

    let new_non_infrastructure = [];

    for(let i = 0; i < non_infrastructure['items'].length; i++) {
      new_non_infrastructure.push({
        "label": non_infrastructure['items'][i]['label'],
        "shortname": non_infrastructure['items'][i]['shortname'],
        "description": non_infrastructure['items'][i]['description'],
        "selected": false
      });
    }

    fetch('/api/geojson/'+e.target.value)
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

            'demand': project['demand'],
            'osm-ids': project['osm-ids'],

            'infrastructure': new_infrastructure,
            'non-infrastructure': new_non_infrastructure,
            'infrastructure-selected': preselected.length ? true : false,
            'non-infrastructure-selected': false,

            'showBenefits': false,
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  onInfrastructureChange(category, shortname, value) {

    const updated = this.state.infrastructure;
    let selected = false;

    // Update the changed one
    for(let item of updated[category]) {

      if(item['shortname'] === shortname) {
        item['selected'] = value;
      }
    }

    // Check if any are selected
    for(let item of updated[category]) {
      if(item['selected']) {
        selected = true;
        break;
      }
    }

    this.setState({
      'infrastructure': updated,
      'infrastructure-selected': selected,
    });
  }

  onNonInfrastructureChange(shortname, value) {

    const updated = this.state['non-infrastructure'];
    let selected = false;

    // Update the changed one
    for(const item of updated) {
      if(item['shortname'] === shortname) {
        item['selected'] = value;
      }
    }

    // Check if any are selected
    for(const item of updated) {
      if(item['selected']) {
        selected = true;
        break;
      }
    }

    this.setState({
      'non-infrastructure': updated,
      'selected-non-infrastructure': selected,
    });
  }

  handleBenefitButton() {

    let demandIncreases = calcDemandIncreases(
        this.state.infrastructure, this.state.subtype, this.state.demand);

    let demandSplits = calcDemandSplits(demandIncreases);

    let vmtReductions = calcVMTReductions(this.state.subtype, this.state.demand);

    let emissionsBenefits = calcEmissionBenefits(
      this.state.county, this.state.year, vmtReductions);

    let healthBenefits = calcHealthBenefits(this.state.subtype, demandIncreases);

    let benefits = {
      'demand-increases': demandIncreases,
      'demand-splits': demandSplits,
      'vmt-reductions': vmtReductions,
      'emissions': emissionsBenefits,
      'health': healthBenefits,
    };

    console.log(benefits);

    this.setState({
      'benefits': benefits,
      'showBenefits': true,
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
                  <select id="existing-project" className="form-select" onChange={this.handleProjectChange}>
                    <option>-- Select a project --</option>
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
              type={this.state['type']}
              subtype={this.state['subtype']}
              city={this.state['city']} />
          </div>
        </div>

        { this.state['selected-project'] ?
        <>

        { this.state['osm-ids'].length ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectMap geojson={this.geojson} />
          </div>
        </div>
        : null }

        { this.state['type'] === 'infrastructure' ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectSummary
              corridors={this.state['osm-ids'].length}
              subtype={this.state['subtype']}
              demand={this.state.demand} />
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
              items={this.state.infrastructure}
            />
          </div>
        </div>
        : null }

        { this.state['infrastructure-selected'] || this.state['non-infrastructure-selected'] ?
        <div className="row mb-3">
          <div className="col-sm-12 text-center">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={this.handleBenefitButton}>Estimate Benefits</button>
          </div>
        </div>
        : null }

        { this.state.showBenefits ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectBenefits
              benefits={this.state.benefits}
              demand={this.state.demand}
              subtype={this.state.subtype} />
          </div>
        </div>
        : null }
      </div>
    );
  }
}

export default BCTool;
