import React from 'react';

import { readableNumber } from '../helpers/formatting';

class HealthBenefits extends React.Component {

  render() {

    let benefits = this.props.benefits;

    return (
      <>
      <h5 className="mt-4">Physical Activity</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th></th>
            <th colSpan="3" className="text-center">Marginal Metabolic Equivalent of Task (MMET) Increase</th>
            <th colSpan="3" className="text-center">MMET Increase / Capita</th>
          </tr>
          <tr>
            <th></th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Bicyling</th>
            <td className="text-end">{readableNumber(benefits.bike.lower)}</td>
            <td className="text-end">{readableNumber(benefits.bike.mean)}</td>
            <td className="text-end">{readableNumber(benefits.bike.upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <th>Walking</th>
            <td className="text-end">{readableNumber(benefits.pedestrian.lower)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.mean)}</td>
            <td className="text-end">{readableNumber(benefits.pedestrian.upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <th>TOTAL</th>
            <td className="text-end">{readableNumber(benefits.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.total.upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
        </tbody>
      </table>
      </>
    );
  }

}

export default HealthBenefits;

