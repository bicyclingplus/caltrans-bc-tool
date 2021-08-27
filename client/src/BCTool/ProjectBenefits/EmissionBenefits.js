import React from 'react';

import { readableNumber } from '../helpers/formatting';

class EmissionBenefits extends React.Component {

  render() {

    let benefits = this.props.benefits;

    let tableRows = benefits.map((item) =>
      <tr key={item['type']}>
        <td>{item['type']}</td>
        <td>{readableNumber(item['NOx'])}</td>
        <td>{readableNumber(item['PM2.5'])}</td>
        <td>{readableNumber(item['PM10'])}</td>
        <td>{readableNumber(item['CO2'])}</td>
        <td>{readableNumber(item['CH4'])}</td>
        <td>{readableNumber(item['N2O'])}</td>
        <td>{readableNumber(item['NH3'])}</td>
        <td>{readableNumber(item['CO'])}</td>
        <td>{readableNumber(item['SOx'])}</td>
      </tr>
    );

    return (
      <>
      <h5>Emission Benefits</h5>
      <table className="table mb-4">
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">NOx</th>
            <th scope="col">PM2.5</th>
            <th scope="col">PM10</th>
            <th scope="col">CO2</th>
            <th scope="col">CH4</th>
            <th scope="col">N2O</th>
            <th scope="col">NH3</th>
            <th scope="col">CO</th>
            <th scope="col">SOx</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
      </>
    );
  }

}

export default EmissionBenefits;


