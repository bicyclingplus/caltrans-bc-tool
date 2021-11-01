import React from 'react';

class ProjectForm extends React.Component {

  render() {

    const {
      name,
      developer,
      cost,
      type,
      subtype,
      city,
      updateName,
      updateDeveloper,
      updateCost,
      updateType,
      updateSubtype,
      updateCity,
    } = this.props;

    return (
      <form>
        <div className="row mb-2">
          <label htmlFor="project-name" className="col-sm-2 col-form-label text-end">Project Name</label>
          <div className="col-sm-4">
            <input type="text" className="form-control" id="project-name" value={name} onChange={updateName} />
          </div>
          <label htmlFor="project-developer" className="col-sm-3 col-form-label text-end">Project Developer</label>
          <div className="col-sm-3">
            <input type="text" className="form-control" id="project-developer" value={developer} onChange={updateDeveloper} />
          </div>
        </div>
        <div className="row mb-2">
          <label htmlFor="project-cost" className="col-sm-2 col-form-label text-end">Project Cost</label>
          <div className="col-sm-2">
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input type="text" className="form-control" id="project-cost" value={cost} onChange={updateCost} />
            </div>
          </div>
        </div>
        <div className="row mb-2">
          <label htmlFor="project-type" className="col-sm-2 col-form-label text-end">Project Type</label>
          <div className="col-md-4">
            <select id="project-type" className="form-select" value={type} onChange={updateType}>
              <option value=""></option>
              <option value="infrastructure">Infrastructure</option>
              <option value="non-infrastructure">Non-Infrastructure</option>
              <option value="both">Infrastructure and Non-Infrastructure</option>
            </select>
          </div>
        </div>

        { type === 'infrastructure' ?
        <div className="row mb-2">
          <label htmlFor="project-subtype" className="col-sm-2 col-form-label text-end">Active Travel Type</label>
          <div className="col-md-4">
            <select id="project-subtype" className="form-select" value={subtype} onChange={updateSubtype}>
              <option value=""></option>
              <option value="pedestrian-only">Pedestrian Only</option>
              <option value="bike-only">Bicyclist Only</option>
              <option value="both">Pedestrian and Bicyclist</option>
            </select>
          </div>
        </div>
        : null }

        <div className="row mb-2">
          <label htmlFor="city" className="col-sm-2 col-form-label text-end">City</label>
          <div className="col-md-4">
            <select id="city" className="form-select" value={city} onChange={updateCity}>
              <option value={city}>{city}</option>
            </select>
          </div>
        </div>
      </form>
    );
  }

}

export default ProjectForm;
