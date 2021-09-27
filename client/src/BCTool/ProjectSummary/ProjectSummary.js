import React from 'react';

class ProjectSummary extends React.Component {

    render() {

        const corridors = this.props.corridors;
        const intersections = this.props.intersections;
        const subtype = this.props.subtype;
        const demand = this.props.demand;

        return (
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center">Project Summary (existing roads and paths only)</h4>

                <h5>Project Reach</h5>
                <ul className="list-unstyled">
                  <li>Number of Intersections: {intersections}</li>
                  <li>Number of Corridors (Blocks): {corridors}</li>
                </ul>

                <h5>Estimated Existing Project Demand *</h5>
                <div className="row">

                  { subtype !== "bike-only" ?
                  <div className="col-sm-6">
                    <u>Daily Pedestrian Miles Traveled</u>
                    <ul className="list-unstyled">
                      <li>Low: {demand.pedestrian.lower} miles</li>
                      <li>Average: {demand.pedestrian.mean} miles</li>
                      <li>High: {demand.pedestrian.upper} miles</li>
                    </ul>
                  </div>
                  : null }

                  { subtype !== "pedestrian-only" ?
                  <div className="col-sm-6">
                    <u>Daily Bicyclist Miles Traveled</u>
                    <ul className="list-unstyled">
                      <li>Low: {demand.bike.lower} miles</li>
                      <li>Average: {demand.bike.mean} miles</li>
                      <li>High: {demand.bike.upper} miles</li>
                    </ul>
                  </div>
                  : null }

                </div>
              </div>
            </div>
        );
    }

}

export default ProjectSummary;