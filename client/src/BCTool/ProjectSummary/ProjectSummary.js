import React from 'react';

class ProjectSummary extends React.Component {

    render() {

        const blockFaces = this.props.blockFaces;
        const intersections = this.props.intersections;
        const subtype = this.props.subtype;
        const travel = this.props.travel;

        return (
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center">Project Summary (existing roads and paths only)</h4>

                <h5>Project Reach</h5>
                <ul className="list-unstyled">
                  <li>Number of Intersections: {intersections}</li>
                  <li>Number of Block Faces: {blockFaces}</li>
                </ul>

                <h5>Estimated Existing Active Travel *</h5>
                <div className="row">

                  { subtype !== "bike-only" ?
                  <div className="col-sm-6">
                    <u>Existing Daily Walking Miles</u>
                    <ul className="list-unstyled">
                      <li>Low: {travel.pedestrian.lower} miles</li>
                      <li>Average: {travel.pedestrian.mean} miles</li>
                      <li>High: {travel.pedestrian.upper} miles</li>
                    </ul>
                  </div>
                  : null }

                  { subtype !== "pedestrian-only" ?
                  <div className="col-sm-6">
                    <u>Existing Daily Bicyling Miles</u>
                    <ul className="list-unstyled">
                      <li>Low: {travel.bike.lower} miles</li>
                      <li>Average: {travel.bike.mean} miles</li>
                      <li>High: {travel.bike.upper} miles</li>
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