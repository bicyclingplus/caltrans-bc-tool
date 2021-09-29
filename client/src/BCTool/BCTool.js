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

import calcDemand from './helpers/calcDemand';
import calcVMTReductions from './helpers/calcVMTReductions';
import calcHealth from './helpers/calcHealth';
import calcEmissions from './helpers/calcEmissions';
import calcSafetyQualitative from './helpers/calcSafetyQualitative';
import calcSafetyQuantitative from './helpers/calcSafetyQuantitative';

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

      'corridors': '',
      'intersections': '',

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

    // console.log(project);
    let preselected = Object.keys(project.infrastructure);
    let new_infrastructure = [];

    for(let category in infrastructure.items) {

      new_infrastructure[category] = [];

      for(let item of infrastructure.items[category]) {

        new_infrastructure[category].push({
          "label": item.label,
          "shortname": item.shortname,
          "description": item.description,
          "selected": preselected.includes(item.shortname),
          "count": preselected.includes(item.shortname) ? project.infrastructure[item.shortname] : 0,
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

            'corridors': project['corridors'] ? project['corridors'] : project['osm-ids'].length,
            'intersections': project['intersections'] ? project['intersections'] : null,

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
        break;
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

  onItemChange = (shortname, value) => {

    // console.log(`Item ${shortname} changed to ${value}`);

    let { infrastructure } = this.state;

    category_loop:
    for(let category in infrastructure) {

      for(let item of infrastructure[category]) {

        if(item.shortname === shortname) {
          item.count = value;
          break category_loop;
        }
      }
    }

    this.setState({
      'infrastructure': infrastructure,
    })

  };

  handleBenefitButton() {

    let demand = calcDemand(
      this.state.infrastructure,
      this.state.subtype,
      this.state.demand,
      this.state.corridors
    )

    let vmtReductions = calcVMTReductions(demand);

    let emissions = calcEmissions(
      this.state.county, this.state.year, vmtReductions);

    let health = calcHealth(this.state.subtype, demand);

    let safetyQualitative = calcSafetyQualitative(this.state.infrastructure);

    let safetyQuantitative = calcSafetyQuantitative(
      this.state.infrastructure, demand);

    let benefits = {
      'demand': demand,
      'vmtReductions': vmtReductions,
      'emissions': emissions,
      'health': health,
      'safetyQualitative': safetyQualitative,
      'safetyQuantitative': safetyQuantitative,
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
              corridors={this.state.corridors}
              intersections={this.state.intersections}
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
              onItemChange={this.onItemChange}
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
