import React from 'react';

import { readableNumber } from '../helpers/formatting';

class ProjectSummary extends React.Component {

    render() {

        const intersections = this.props.intersections;
        const length = this.props.length;
        const subtype = this.props.subtype;
        const travel = this.props.travel;

        return (
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center">Project Summary (existing roads and paths only)</h4>

                <h5>Project Reach</h5>
                <ul className="list-unstyled">
                  <li>Number of Intersections: {intersections}</li>
                  <li>Length: {readableNumber(length/5280, 1)} miles</li>
                </ul>

                <h5>Estimated Existing Active Travel *</h5>
                <div className="row">

                  { subtype !== "bike-only" ?
                  <div className="col-sm-6">
                    <u>Existing Daily Walking Miles</u>
                    <ul className="list-unstyled">
                      <li>Low: {readableNumber(travel.miles.pedestrian.lower)} miles</li>
                      <li>Average: {readableNumber(travel.miles.pedestrian.mean)} miles</li>
                      <li>High: {readableNumber(travel.miles.pedestrian.upper)} miles</li>
                    </ul>
                  </div>
                  : null }

                  { subtype !== "pedestrian-only" ?
                  <div className="col-sm-6">
                    <u>Existing Daily Bicyling Miles</u>
                    <ul className="list-unstyled">
                      <li>Low: {readableNumber(travel.miles.bike.lower)} miles</li>
                      <li>Average: {readableNumber(travel.miles.bike.mean)} miles</li>
                      <li>High: {readableNumber(travel.miles.bike.upper)} miles</li>
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