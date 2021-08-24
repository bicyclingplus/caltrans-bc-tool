import React from 'react';

import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/button';

import './BCTool.css';

import CategorizedCheckboxDropdown from './CategorizedCheckboxDropdown';
import CheckboxDropdown from './CheckboxDropdown';

import ProjectForm from './ProjectForm';
import ProjectSummary from './ProjectSummary';
import ProjectMap from './ProjectMap';
import SelectedInfrastructure from './SelectedInfrastructure';

const infrastructure = require('./data/infrastructure.json');
const nonInfrastructure = require('./data/nonInfrastructure.json');

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

      'infrastructure': [],
      'non-infrastructure': [],
      'selectedInfrastructure': 0,
      'selectedNonInfrastructure': 0,

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

  componentWillUnmount() {

  }

  handleProjectChange(e) {

    let project;

    for(let i = 0; i < this.state['existing-projects'].length; i++) {
      if(this.state['existing-projects'][i]['id'] === parseInt(e.target.value)) {
        project = this.state['existing-projects'][i];
      }
    }

    let newInfrastructure = [];

    for(let category in infrastructure['items']) {

      newInfrastructure[category] = [];

      let current = infrastructure['items'][category];

      for(let i = 0; i < current.length; i++) {
        newInfrastructure[category].push({
          "label": current[i]['label'],
          "shortname": current[i]['shortname'],
          "description": current[i]['description'],
          "selected": false
        });
      }
    }

    let newNonInfrastructure = [];

    for(let i = 0; i < nonInfrastructure['items'].length; i++) {
      newNonInfrastructure.push({
        "label": nonInfrastructure['items'][i]['label'],
        "shortname": nonInfrastructure['items'][i]['shortname'],
        "description": nonInfrastructure['items'][i]['description'],
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

            'demand': project['demand'],
            'osm-ids': project['osm-ids'],

            'infrastructure': newInfrastructure,
            'non-infrastructure': newNonInfrastructure,
            'selectedInfrastructure': 0,

            'showBenefits': false,
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  onInfrastructureChange(category, shortname, value) {

    let updated = this.state.infrastructure,
        selected = this.state.selectedInfrastructure;

    for(let i = 0; i < updated[category].length; i++) {
      if(updated[category][i]['shortname'] === shortname) {
        updated[category][i]['selected'] = value;
        break;
      }
    }

    this.setState({
      'infrastructure': updated,
      'selectedInfrastructure': value ? selected + 1 : selected - 1,
    });
  }

  onNonInfrastructureChange(shortname, value) {

    let updated = this.state['non-infrastructure'],
        selected = this.state.selectedInfrastructure;

    for(let i = 0; i < updated.length; i++) {
      if(updated[i]['shortname'] === shortname) {
        updated[i]['selected'] = value;
        break;
      }
    }

    this.setState({
      'non-infrastructure': updated,
      'selectedNonInfrastructure': value ? selected + 1 : selected - 1,
    });
  }

  handleBenefitButton() {

    this.setState({
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
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center">Define Project Elements</h4>

                { this.state['type'] === 'infrastructure' ?
                <div className="row mb-3 mt-4">
                  <div className="col-sm-4"><h5 className="form-label">Infrastructure Elements</h5></div>
                  <div className="col-sm-8">
                    <CategorizedCheckboxDropdown
                      id="infrastructure-dropdown"
                      className="col-sm-10"
                      buttonText="Click to select"
                      maxLength="75"
                      name="infrastructure"
                      items={this.state.infrastructure}
                      onChange={this.onInfrastructureChange}
                      />
                  </div>
                </div>
                : null }

                { this.state['type'] === 'non-infrastructure' ?
                <div className="row mb-3">
                  <div className="col-sm-4"><h5 className="form-label">Non-Infrastructure Elements</h5></div>
                  <div className="col-sm-8">
                    <CheckboxDropdown
                      id="non-infrastructure-dropdown"
                      className="col-sm-10"
                      buttonText="Click to select"
                      maxLength="75"
                      name="non-infrastructure"
                      items={this.state['non-infrastructure']}
                      onChange={this.onNonInfrastructureChange}
                      />
                  </div>
                </div>
                : null }

              </div>
            </div>
          </div>
        </div>
        </>
        : null }

        { this.state.selectedInfrastructure > 0 ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <SelectedInfrastructure
              items={this.state.infrastructure}
            />
          </div>
        </div>
        : null }

        { this.state.selectedInfrastructure > 0 || this.state.selectedNonInfrastructure > 0 ?
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
          <div className="col-sm-12 text-center">
            <div className="card">
              <div className="card-body">
                  <h4 className="card-title text-center">Benefits</h4>
              </div>
            </div>
          </div>
        </div>
        : null }
      </div>
    );
  }
}

export default BCTool;
