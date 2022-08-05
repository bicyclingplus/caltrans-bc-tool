import React from 'react';
import {
  PROJECT_TYPES,
  PROJECT_SUBTYPES,
  TRANSIT_TYPES,
} from '../helpers/constants';

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

    let projectTypeOptions = [];

    for(let project_type in PROJECT_TYPES) {
      projectTypeOptions.push(
        <option value={project_type} key={project_type}>{PROJECT_TYPES[project_type]}</option>
      )
    }

    let projectSubtypeOptions = [];

    for(let project_subtype in PROJECT_SUBTYPES) {
      projectSubtypeOptions.push(
        <option value={project_subtype} key={project_subtype}>{PROJECT_SUBTYPES[project_subtype]}</option>
      )
    }

    let transitTypeOptions = [];

    for(let transit_type in TRANSIT_TYPES) {
      transitTypeOptions.push(
        <option value={transit_type} key={transit_type}>{TRANSIT_TYPES[transit_type]}</option>
      )
    }

    return (
      <div className="row mb-4">
        <p className="text-center">All fields marked with * are required</p>
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
            <label htmlFor="project-type" className="col-sm-4 col-form-label text-end">Project Type *</label>
            <div className="col-md-8">
              <select id="project-type" className="form-select" value={type} onChange={updateType}>
                <option value="" disabled>-- Choose a type --</option>
                {projectTypeOptions}
              </select>
            </div>
          </div>

          { type === 'infrastructure' || type === 'both' ?
          <>
          <div className="row mb-2">
            <label htmlFor="project-subtype" className="col-sm-4 col-form-label text-end">Active Travel Type *</label>
            <div className="col-md-8">
              <select id="project-subtype" className="form-select" value={subtype} onChange={updateSubtype}>
                <option value="" disabled>-- Choose a type --</option>
                {projectSubtypeOptions}
              </select>
            </div>
          </div>

          <div className="row mb-2">
            <label htmlFor="project-transit" className="col-sm-4 col-form-label text-end">Transit Type *</label>
            <div className="col-md-8">
              <select id="project-subtype" className="form-select" value={transit} onChange={updateTransit}>
                <option value="" disabled>-- Choose a type --</option>
                {transitTypeOptions}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 offset-sm-2 col-form-label text-center">Bike</div>
            <div className="col-sm-4 offset-sm-2 col-form-label text-center">Pedestrian</div>
          </div>

          <div className="row">
            <div className="col-sm-2 offset-sm-2 col-form-label text-center" style={{fontSize: '0.7rem'}}>Intersections</div>
            <div className="col-sm-2 col-form-label text-center" style={{fontSize: '0.7rem'}}>Roadways</div>
            <div className="col-sm-2 offset-sm-2 col-form-label text-center" style={{fontSize: '0.7rem'}}>Intersections</div>
            <div className="col-sm-2 col-form-label text-center" style={{fontSize: '0.7rem'}}>Roadways</div>
          </div>

          <div className="row mb-2">
            <label className="col-sm-2 col-form-label text-end">Crashes</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-crashes-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-crashes-roadways" />
            </div>
            <label className="col-sm-2 col-form-label text-end">Crashes</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-crashes-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-crashes-roadways" />
            </div>
          </div>

          <div className="row mb-2">
            <label className="col-sm-2 col-form-label text-end">Injuries</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-injuries-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-injuries-roadways" />
            </div>
            <label className="col-sm-2 col-form-label text-end">Injuries</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-injuries-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-injuries-roadways" />
            </div>
          </div>

          <div className="row mb-2">
            <label className="col-sm-2 col-form-label text-end">Deaths</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-deaths-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-deaths-roadways" />
            </div>
            <label className="col-sm-2 col-form-label text-end">Deaths</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-deaths-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-deaths-roadways" />
            </div>
          </div>

          <div className="row mb-2">
            <label className="col-sm-2 col-form-label text-end">Years</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-years-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-bike-years-roadways" />
            </div>
            <label className="col-sm-2 col-form-label text-end">Years</label>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-years-intersections" />
            </div>
            <div className="col-sm-2">
              <input className="form-control" type="text" id="project-risk-ped-years-roadways" />
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
