import React from 'react';

class ProjectForm extends React.Component {

  render() {

    const {
      name,
      developer,
      cost,
      timeframe,
      type,
      subtype,
      transit,
      updateName,
      updateDeveloper,
      updateCost,
      updateType,
      updateSubtype,
      updateTimeFrame,
      updateTransit,
    } = this.props;

    return (
      <div className="row mb-4">
        <form>
          <div className="row mb-2">
            <label htmlFor="project-name" className="col-sm-4 col-form-label text-end">Project Name</label>
            <div className="col-sm-8">
              <input type="text" className="form-control" id="project-name" value={name} onChange={updateName} />
            </div>
          </div>
          <div className="row mb-2">
            <label htmlFor="project-developer" className="col-sm-4 col-form-label text-end">Project Developer</label>
            <div className="col-sm-8">
              <input type="text" className="form-control" id="project-developer" value={developer} onChange={updateDeveloper} />
            </div>
          </div>
          <div className="row mb-2">
            <label htmlFor="project-cost" className="col-sm-4 col-form-label text-end">Project Cost</label>
            <div className="col-sm-8">
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="text" className="form-control" id="project-cost" value={cost} onChange={updateCost} />
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <label htmlFor="project-type" className="col-sm-4 col-form-label text-end">Project Time Frame</label>
            <div className="col-md-8">
              <select id="project-time-frame" className="form-select" value={timeframe} onChange={updateTimeFrame}>
                <option value="" disabled>-- Choose a time frame --</option>
                <option value="1">1 year</option>
                <option value="20">20 years (default)</option>
              </select>
            </div>
          </div>
          <div className="row mb-2">
            <label htmlFor="project-type" className="col-sm-4 col-form-label text-end">Project Type</label>
            <div className="col-md-8">
              <select id="project-type" className="form-select" value={type} onChange={updateType}>
                <option value="" disabled>-- Choose a type --</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="non-infrastructure">Non-Infrastructure</option>
                <option value="both">Infrastructure and Non-Infrastructure</option>
              </select>
            </div>
          </div>

          { type === 'infrastructure' || type === 'both' ?
          <>
          <div className="row mb-2">
            <label htmlFor="project-subtype" className="col-sm-4 col-form-label text-end">Active Travel Type</label>
            <div className="col-md-8">
              <select id="project-subtype" className="form-select" value={subtype} onChange={updateSubtype}>
                <option value="" disabled>-- Choose a type --</option>
                <option value="pedestrian-only">Pedestrian Only</option>
                <option value="bike-only">Bicyclist Only</option>
                <option value="both">Pedestrian and Bicyclist</option>
              </select>
            </div>
          </div>

          <div className="row mb-2">
            <label htmlFor="project-transit" className="col-sm-4 col-form-label text-end">Transit Type</label>
            <div className="col-md-8">
              <select id="project-subtype" className="form-select" value={transit} onChange={updateTransit}>
                <option value="" disabled>-- Choose a type --</option>
                <option value="hubs">Connections to major transit hub(s)</option>
                <option value="stops">Connections to transit stops</option>
                <option value="none">no transit connections</option>
              </select>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-sm-3 offset-sm-3 col-form-label text-center">Bike</div>
            <div className="col-sm-3 offset-sm-3 col-form-label text-center">Pedestrian</div>
          </div>

          <div className="row mb-2">
            <label htmlFor="project-risk-bike-crashes" className="col-sm-3 col-form-label text-end">Crashes</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-bike-crashes" />
            </div>
            <label htmlFor="project-risk-ped-crashes" className="col-sm-3 col-form-label text-end">Crashes</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-ped-crashes" />
            </div>
          </div>

          <div className="row mb-2">
            <label htmlFor="project-risk-bike-injuries" className="col-sm-3 col-form-label text-end">Injuries</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-bike-injuries" />
            </div>
            <label htmlFor="project-risk-ped-injuries" className="col-sm-3 col-form-label text-end">Injuries</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-ped-injuries" />
            </div>
          </div>

          <div className="row mb-2">
            <label htmlFor="project-risk-bike-deaths" className="col-sm-3 col-form-label text-end">Deaths</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-bike-deaths" />
            </div>
            <label htmlFor="project-risk-ped-deaths" className="col-sm-3 col-form-label text-end">Deaths</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-ped-deaths" />
            </div>
          </div>

          <div className="row mb-2">
            <label htmlFor="project-risk-bike-years" className="col-sm-3 col-form-label text-end">Years</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-bike-years" />
            </div>
            <label htmlFor="project-risk-ped-years" className="col-sm-3 col-form-label text-end">Years</label>
            <div className="col-md-3">
              <input className="form-control" type="text" id="project-risk-ped-years" />
            </div>
          </div>
          </>
          : null }
        </form>
      </div>
    );
  }

}

export default ProjectForm;
