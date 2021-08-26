import React from 'react';

class ProjectForm extends React.Component {

  render() {

    let name = this.props.name;
    let developer = this.props.developer;
    let cost = this.props.cost;
    let type = this.props.type;
    let subtype = this.props.subtype;
    let city = this.props.city;

    return (
      <form>
        <div className="row mb-2">
          <label htmlFor="project-name" className="col-sm-2 col-form-label text-end">Project Name</label>
          <div className="col-sm-4">
            <input type="text" className="form-control" id="project-name" value={name} disabled />
          </div>
          <label htmlFor="project-developer" className="col-sm-3 col-form-label text-end">Project Developer</label>
          <div className="col-sm-3">
            <input type="text" className="form-control" id="project-developer"  value={developer} disabled />
          </div>
        </div>
        <div className="row mb-2">
          <label htmlFor="project-cost" className="col-sm-2 col-form-label text-end">Project Cost</label>
          <div className="col-sm-2">
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input type="text" className="form-control" id="project-cost"  value={cost} disabled />
            </div>
          </div>
        </div>
        <div className="row mb-2">
          <label htmlFor="project-type" className="col-sm-2 col-form-label text-end">Project Type</label>
          <div className="col-md-4">
            <select id="project-type" className="form-select" value={type} disabled>
              <option value=""></option>
              <option value="infrastructure">Infrastructure</option>
              <option value="non-infrastructure">Non-Infrastructure</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        { type === 'infrastructure' ?
        <div className="row mb-2">
          <label htmlFor="project-subtype" className="col-sm-2 col-form-label text-end">Project Subtype</label>
          <div className="col-md-4">
            <select id="project-subtype" className="form-select" value={subtype} disabled>
              <option value=""></option>
              <option value="bike-only">Bike Only</option>
              <option value="pedestrian-only">Pedestrian Only</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        : null }

        <div className="row mb-2">
          <label htmlFor="city" className="col-sm-2 col-form-label text-end">City</label>
          <div className="col-md-4">
            <select id="city" className="form-select" value={city} disabled>
              <option value={city}>{city}</option>
            </select>
          </div>
        </div>
      </form>
    );
  }

}

export default ProjectForm;
