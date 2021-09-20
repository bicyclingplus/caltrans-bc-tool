import React from 'react';

class DemandIncreaseTable extends React.Component {

  render() {

    let benefits = this.props.benefits;


    return (
      <>
      <h5 className="mb-4">Project-Level Active Travel</h5>

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
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowSpan="4">Increase</td>
            <td>Induced Travel</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Car Shift</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan="2">Projected (Existing + Increase)</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

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
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowSpan="4">Increase</td>
            <td>Induced Travel</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Route Shift</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Car Shift</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan="2">Projected (Existing + Increase)</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </>
    );
  }

}

export default DemandIncreaseTable;
