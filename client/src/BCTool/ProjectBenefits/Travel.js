import React from 'react';

import { readableNumber } from '../helpers/formatting';

class Travel extends React.Component {

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
            <th colSpan="2"></th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
          </tr>
          <tr>
            <td colSpan="2">Existing</td>
            <td className="text-end">{readableNumber(benefits.bike.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.existing.upper)}</td>
          </tr>
          <tr>
            <td rowSpan="5">Increase</td>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.bike.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.inducedTravel.upper)}</td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.bike.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.routeShift.upper)}</td>
          </tr>
          <tr>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.bike.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.carShift.upper)}</td>
          </tr>
          <tr>
            <td>Residual</td>
            <td className="text-end">{readableNumber(benefits.bike.residual.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.residual.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.residual.upper)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.bike.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.total.upper)}</td>
          </tr>
          <tr>
            <td colSpan="2">Projected (Existing + Increase)</td>
            <td className="text-end">{readableNumber(benefits.bike.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.projected.upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
      : null }

      <h5>Estimated Average Daily Walk Miles Traveled (WMT)</h5>
      <table className="table table-bordered mb-4">
        <tbody>
          <tr>
            <th colSpan="2"></th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
          </tr>
          <tr>
            <td colSpan="2">Existing</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.existing.upper)}</td>
          </tr>
          <tr>
            <td rowSpan="5">Increase</td>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.inducedTravel.upper)}</td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.routeShift.upper)}</td>
          </tr>
          <tr>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.carShift.upper)}</td>
          </tr>
          <tr>
            <td>Residual</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.residual.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.residual.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.residual.upper)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.pedestrian.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.total.upper)}</td>
          </tr>
          <tr>
            <td colSpan="2">Projected (Existing + Increase)</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.projected.upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
    );
  }

}

export default Travel;
