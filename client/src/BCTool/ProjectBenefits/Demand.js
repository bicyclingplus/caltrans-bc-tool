import React from 'react';

import { readableNumber } from '../helpers/formatting';

class Demand extends React.Component {

  render() {

    let benefits = this.props.benefits;

    return (
      <>
      <h5 className="mb-4">1/2) Total Demand / Active Travel Increase Demand Split</h5>
      <h5 className="mb-4">Project-Level Active Travel</h5>

      { 'bike' in benefits ?
      <>
      <h5>Estimated Average Daily Bike Miles Traveled (BMT)</h5>
      <table className="table table-bordered mb-4">
        <tbody>
          <tr>
            <td colSpan="2"></td>
            <td>Mean</td>
            <td>Lower</td>
            <td>Upper</td>
          </tr>
          <tr>
            <td colSpan="2">Existing</td>
            <td>{readableNumber(benefits.bike.existing.lower)}</td>
            <td>{readableNumber(benefits.bike.existing.mean)}</td>
            <td>{readableNumber(benefits.bike.existing.upper)}</td>
          </tr>
          <tr>
            <td rowSpan="5">Increase</td>
            <td>Induced Travel</td>
            <td>{readableNumber(benefits.bike.inducedTravel.lower)}</td>
            <td>{readableNumber(benefits.bike.inducedTravel.mean)}</td>
            <td>{readableNumber(benefits.bike.inducedTravel.upper)}</td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td>{readableNumber(benefits.bike.routeShift.lower)}</td>
            <td>{readableNumber(benefits.bike.routeShift.mean)}</td>
            <td>{readableNumber(benefits.bike.routeShift.upper)}</td>
          </tr>
          <tr>
            <td>Car Shift</td>
            <td>{readableNumber(benefits.bike.carShift.lower)}</td>
            <td>{readableNumber(benefits.bike.carShift.mean)}</td>
            <td>{readableNumber(benefits.bike.carShift.upper)}</td>
          </tr>
          <tr>
            <td>Residual</td>
            <td>{readableNumber(benefits.bike.residual.lower)}</td>
            <td>{readableNumber(benefits.bike.residual.mean)}</td>
            <td>{readableNumber(benefits.bike.residual.upper)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td>{readableNumber(benefits.bike.total.lower)}</td>
            <td>{readableNumber(benefits.bike.total.mean)}</td>
            <td>{readableNumber(benefits.bike.total.upper)}</td>
          </tr>
          <tr>
            <td colSpan="2">Projected (Existing + Increase)</td>
            <td>{readableNumber(benefits.bike.projected.lower)}</td>
            <td>{readableNumber(benefits.bike.projected.mean)}</td>
            <td>{readableNumber(benefits.bike.projected.upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
      : null }

      <h5>Estimated Average Daily Walk Miles Traveled (WMT)</h5>
      <table className="table table-bordered mb-4">
        <tbody>
          <tr>
            <td colSpan="2"></td>
            <td>Mean</td>
            <td>Lower</td>
            <td>Upper</td>
          </tr>
          <tr>
            <td colSpan="2">Existing</td>
            <td>{readableNumber(benefits.pedestrian.existing.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.existing.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.existing.upper)}</td>
          </tr>
          <tr>
            <td rowSpan="5">Increase</td>
            <td>Induced Travel</td>
            <td>{readableNumber(benefits.pedestrian.inducedTravel.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.inducedTravel.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.inducedTravel.upper)}</td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td>{readableNumber(benefits.pedestrian.routeShift.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.routeShift.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.routeShift.upper)}</td>
          </tr>
          <tr>
            <td>Car Shift</td>
            <td>{readableNumber(benefits.pedestrian.carShift.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.carShift.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.carShift.upper)}</td>
          </tr>
          <tr>
            <td>Residual</td>
            <td>{readableNumber(benefits.pedestrian.residual.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.residual.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.residual.upper)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td>{readableNumber(benefits.pedestrian.total.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.total.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.total.upper)}</td>
          </tr>
          <tr>
            <td colSpan="2">Projected (Existing + Increase)</td>
            <td>{readableNumber(benefits.pedestrian.projected.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.projected.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.projected.upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
    );
  }

}

export default Demand;
