import React from 'react';
import Leaflet from 'leaflet';

import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/button';

import 'leaflet/dist/leaflet.css';
import './BCTool.css';

import CategorizedCheckboxDropdown from './CategorizedCheckboxDropdown';
import CheckboxDropdown from './CheckboxDropdown';

const infrastructure = require('./infrastructure.json');
const nonInfrastructure = require('./nonInfrastructure.json');

class BCTool extends React.Component {

  constructor(props) {
    super(props);

    this.map = null;
    this.features = null;


    let checkboxes = {};
    for(let category in infrastructure.items) {

      for(let i = 0; i < infrastructure.items[category].length; i++) {
        checkboxes[infrastructure.items[category][i]['shortname']] = false;
      }

    }

    for(let i = 0; i < nonInfrastructure.items.length; i++ ) {
      checkboxes[nonInfrastructure.items[i]['shortname']] = false;
    }

    this.state = {
      'existing': [],
      'project-type': '',
      'project-subtype': '',
      'selected-project': '',
      'project-name': '',
      'project-developer': '',
      'project-cost': '',
      'city': '',
      'county': '',
      'checkboxes': checkboxes,
    };

    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.updateMap = this.updateMap.bind(this);
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

    this.setState({
      'selected-project': e.target.value,
      'project-type': project['project-type'],
      'project-subtype': project['project-subtype'],
      'project-name': project['project-name'],
      'project-developer': project['project-developer'],
      'project-cost': project['project-cost'],
      'county': project['county'],
      'city': project['city'],
    });

    fetch('/api/geojson/'+e.target.value)
      .then((res) => res.json())
      .then(
        (result) => {
          this.geojson = result;
          this.updateMap();
        },
        (error) => {
          console.log(error);
        },
      );
  }

  updateMap() {
    if(!this.map) {
      this.map = Leaflet.map('map');

      Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoibWZhdmV0dGkiLCJhIjoiY2tvYnFyYndpMDB2dDJwcGRiM3h4dG9sciJ9.lpkeRUBN_K546qVPWRs2BA'
      }).addTo(this.map);
    }

    if(this.features) {
      this.map.removeLayer(this.features);
    }

    this.features = Leaflet.geoJSON(this.geojson);
    this.features.addTo(this.map);
    this.map.fitBounds(this.features.getBounds());
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
          <div className="col-sm-8 p-4">
            <form>
              <div className="row mb-2">
                <label htmlFor="existing-project" className="col-sm-2 col-form-label text-end">Existing Project</label>
                <div className="col-md-10">
                  <select id="existing-project" className="form-select" onChange={this.handleProjectChange}>
                    <option>-- Select a project --</option>
                    {this.state.existing.map((project) => <option key={project['project-id']} value={project['project-id']}>{project['project-name']}</option>)}
                  </select>
                </div>
              </div>
              <div className="row mb-2">
                <label htmlFor="project-name" className="col-sm-2 col-form-label text-end">Project Name</label>
                <div className="col-sm-4">
                  <input type="text" className="form-control" id="project-name" value={this.state['project-name']} disabled />
                </div>
                <label htmlFor="project-developer" className="col-sm-3 col-form-label text-end">Project Developer</label>
                <div className="col-sm-3">
                  <input type="text" className="form-control" id="project-developer"  value={this.state['project-developer']} disabled />
                </div>
              </div>
              <div className="row mb-2">
                <label htmlFor="project-cost" className="col-sm-2 col-form-label text-end">Project Cost</label>
                <div className="col-sm-2">
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="text" className="form-control" id="project-cost"  value={this.state['project-cost']} disabled />
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <label htmlFor="project-type" className="col-sm-2 col-form-label text-end">Project Type</label>
                <div className="col-md-4">
                  <select id="project-type" className="form-select" value={this.state['project-type']} disabled>
                    <option value=""></option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="non-infrastructure">Non-Infrastructure</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div className="row mb-2">
                <label htmlFor="project-subtype" className="col-sm-2 col-form-label text-end">Project Subtype</label>
                <div className="col-md-4">
                  <select id="project-subtype" className="form-select" value={this.state['project-subtype']} disabled>
                    <option value=""></option>
                    <option value="bike-only">Bike Only</option>
                    <option value="pedestrian-only">Pedestrian Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div className="row mb-2">
                <label htmlFor="city" className="col-sm-2 col-form-label text-end">City</label>
                <div className="col-md-4">
                  <select id="city" className="form-select" value={this.state.city} disabled>
                    <option value={this.state.city}>{this.state.city}</option>
                  </select>
                </div>
              </div>
            </form>

          </div>
        </div>

        { this.state['selected-project'] ?
        <div className="row mb-3">
          <div className="col-sm-12">
            <div id="map"></div>
          </div>
        </div>
        : null }

        <div className="row mb-3">
          <div className="col-sm-12">
            <h4>Define Project Elements</h4>

            <div className="row mb-3">
              <div className="col-sm-4"><h5 class="form-label">Infrastructure Elements</h5></div>
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
              <div className="col-sm-4"><h5 class="form-label">Non-Infrastructure Elements</h5></div>
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
    );
  }
}

export default BCTool;
