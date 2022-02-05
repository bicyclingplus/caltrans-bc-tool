import React from 'react';

import { readableNumber } from '../helpers/formatting';

class Travel extends React.Component {

  render() {

    let benefits = this.props.benefits;

    return (
      <>
      <h4 className="mt-4">Project-Level Active Travel</h4>

      { 'bike' in benefits ?
      <>
      <h5 className="mt-4">Estimated Average Daily Bike Miles Traveled (BMT)</h5>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th colSpan="2"></th>
            <th colSpan="3" className="text-center">Bike Miles Travelled (BMT)</th>
            <th colSpan="3" className="text-center">BMT / Capita</th>
            <th colSpan="3" className="text-center">BMT / Jobs</th>
          </tr>
          <tr>
            <th colSpan="2"></th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
          </tr>
          <tr>
            <th colSpan="2">Existing</th>
            <td className="text-end">{readableNumber(benefits.bike.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.existing.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan="5" className="align-middle">Increase in Active Travel</th>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.bike.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.carShift.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.bike.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.routeShift.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.bike.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.inducedTravel.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Shift from Other Modes</td>
            <td className="text-end">{readableNumber(benefits.bike.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.otherShift.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.bike.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.total.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th colSpan="2">Projected (Existing + Increase)</th>
            <td className="text-end">{readableNumber(benefits.bike.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.projected.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </>
      : null }

      { 'pedestrian' in benefits ?
      <>
      <h5 className="mt-4">Estimated Average Daily Walk Miles Traveled (WMT)</h5>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th colSpan="2"></th>
            <th colSpan="3" className="text-center">Walk Miles Traveled (WMT)</th>
            <th colSpan="3" className="text-center">WMT / Capita</th>
            <th colSpan="3" className="text-center">WMT / Jobs</th>
          </tr>
          <tr>
            <th colSpan="2"></th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
          </tr>
          <tr>
            <th colSpan="2">Existing</th>
            <td className="text-end">{readableNumber(benefits.pedestrian.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.existing.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan="5" className="align-middle">Increase in Active Travel</th>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.carShift.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.routeShift.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.inducedTravel.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Shift from Other Modes</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.otherShift.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.pedestrian.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.total.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th colSpan="2">Projected (Existing + Increase)</th>
            <td className="text-end">{readableNumber(benefits.pedestrian.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.projected.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </>
      : null }
      </>
    );
  }

}

export default Travel;
