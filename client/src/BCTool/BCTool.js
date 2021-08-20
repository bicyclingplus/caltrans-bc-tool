import React from 'react';

import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/button';

import './BCTool.css';

import CategorizedCheckboxDropdown from './CategorizedCheckboxDropdown';
import CheckboxDropdown from './CheckboxDropdown';

import ProjectForm from './ProjectForm';
import ProjectSummary from './ProjectSummary';
import ProjectMap from './ProjectMap';

const infrastructure = require('./infrastructure.json');
const nonInfrastructure = require('./nonInfrastructure.json');

class BCTool extends React.Component {

  constructor(props) {
    super(props);

    this.map = null;
    this.features = null;

    this.state = {
      'existing': [],
      'type': '',
      'subtype': '',
      'selected-project': '',
      'name': '',
      'developer': '',
      'cost': '',
      'city': '',
      'county': '',
      'checkboxes': [],
    };

    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.onCheckedChange = this.onCheckedChange.bind(this);

  }

  componentDidMount() {

    fetch('/api/existing')
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            'existing': result,
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

    for(let i = 0; i < this.state.existing.length; i++) {
      if(this.state.existing[i]['project-id'] === parseInt(e.target.value)) {
        project = this.state.existing[i];
      }
    }

    let checkboxes = {};
    for(let category in infrastructure.items) {

      for(let i = 0; i < infrastructure.items[category].length; i++) {
        checkboxes[infrastructure.items[category][i]['shortname']] = false;
      }

    }

    for(let i = 0; i < nonInfrastructure.items.length; i++ ) {
      checkboxes[nonInfrastructure.items[i]['shortname']] = false;
    }

    fetch('/api/geojson/'+e.target.value)
      .then((res) => res.json())
      .then(
        (result) => {
          this.geojson = result;

          this.setState({
            'selected-project': e.target.value,
            'type': project['project-type'],
            'subtype': project['project-subtype'],
            'name': project['project-name'],
            'developer': project['project-developer'],
            'cost': project['project-cost'],
            'county': project['county'],
            'city': project['city'],
            'demand': project['demand'],
            'osm-ids': project['osm-ids'],
            'checkboxes': checkboxes,
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  onCheckedChange(shortname, value) {

    let updatedCheckboxes = this.state.checkboxes;

    updatedCheckboxes[shortname] = value;

    this.setState({
      checkboxes: updatedCheckboxes
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
                    {this.state.existing.map((project) => <option key={project['project-id']} value={project['project-id']}>{project['project-name']}</option>)}
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
        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectMap geojson={this.geojson} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-12">
            <ProjectSummary
              corridors={this.state['osm-ids'].length}
              subtype={this.state['project-subtype']}
              demand={this.state.demand} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center">Define Project Elements</h4>

                <div className="row mb-3 mt-4">
                  <div className="col-sm-4"><h5 className="form-label">Infrastructure Elements</h5></div>
                  <div className="col-sm-8">
                    <CategorizedCheckboxDropdown
                      id="infrastructure-dropdown"
                      className="col-sm-10"
                      buttonText="Click to select"
                      name="infrastructure"
                      items={infrastructure.items}
                      checkboxes={this.state.checkboxes}
                      onCheckedChange={this.onCheckedChange}
                      />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-sm-4"><h5 className="form-label">Non-Infrastructure Elements</h5></div>
                  <div className="col-sm-8">
                    <CheckboxDropdown
                      id="non-infrastructure-dropdown"
                      className="col-sm-10"
                      buttonText="Click to select"
                      name="non-infrastructure"
                      items={nonInfrastructure.items}
                      checkboxes={this.state.checkboxes}
                      onCheckedChange={this.onCheckedChange}
                      />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
        : null }

      </div>
    );
  }
}

export default BCTool;
