import React from 'react';

import { readableNumber } from '../helpers/formatting';

class HealthBenefits extends React.Component {

  render() {

    let benefits = this.props.benefits;

    return (
      <>
      <h5>7) Health Benefits</h5>
      <table className="table table-bordered mb-4 text-center">
        <thead>
          <tr>
            <th></th>
            <th colSpan="3">Marginal Metabolic Equivalent of Task (MMET) Increase</th>
            <th colSpan="3">MMET Increase / Capita</th>
          </tr>
          <tr>
            <th></th>
            <th>Lower</th>
            <th>Mean</th>
            <th>Upper</th>
            <th>Lower</th>
            <th>Mean</th>
            <th>Upper</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Bicyling</th>
            <td>{readableNumber(benefits.bike.lower)}</td>
            <td>{readableNumber(benefits.bike.mean)}</td>
            <td>{readableNumber(benefits.bike.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Walking</th>
            <td>{readableNumber(benefits.pedestrian.lower)}</td>
            <td>{readableNumber(benefits.pedestrian.mean)}</td>
            <td>{readableNumber(benefits.pedestrian.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>TOTAL</th>
            <td>{readableNumber(benefits.total.lower)}</td>
            <td>{readableNumber(benefits.total.mean)}</td>
            <td>{readableNumber(benefits.total.upper)}</td>
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

export default HealthBenefits;

