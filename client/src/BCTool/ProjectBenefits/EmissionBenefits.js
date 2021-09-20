import React from 'react';

import { readableNumber } from '../helpers/formatting';

class Emissionemissions extends React.Component {

  render() {

    let emissions = this.props.emissions;
    let vmt = this.props.vmt;

    return (
      <>
      <h5>Emission Benefits</h5>
      <table className="table table-bordered mb-4">
        <tbody>
          <tr>
            <td></td>
            <td colSpan="3" className="text-center">Annual Reduction</td>
            <td colSpan="3" className="text-center">Annual Reduction / Capita</td>
          </tr>
          <tr>
            <td></td>
            <td>Lower</td>
            <td>Mean</td>
            <td>Upper</td>
            <td>Lower</td>
            <td>Mean</td>
            <td>Upper</td>
          </tr>
          <tr>
            <td>Vehicle Miles Traveled</td>
            <td>{readableNumber(vmt.total.lower)}</td>
            <td>{readableNumber(vmt.total.mean)}</td>
            <td>{readableNumber(vmt.total.upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan="7" className="text-center">In-use Emission Reductions (units)</td>
          </tr>
          <tr>
            <th colSpan="7">Greenhouse Gasses</th>
          </tr>
          <tr>
            <td>CO2</td>
            <td>{readableNumber(emissions['CO2'].lower)}</td>
            <td>{readableNumber(emissions['CO2'].mean)}</td>
            <td>{readableNumber(emissions['CO2'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>CH4</td>
            <td>{readableNumber(emissions['CH4'].lower)}</td>
            <td>{readableNumber(emissions['CH4'].mean)}</td>
            <td>{readableNumber(emissions['CH4'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>N2O</td>
            <td>{readableNumber(emissions['N2O'].lower)}</td>
            <td>{readableNumber(emissions['N2O'].mean)}</td>
            <td>{readableNumber(emissions['N2O'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th colSpan="7">Air Toxins</th>
          </tr>
          <tr>
            <td>NOx</td>
            <td>{readableNumber(emissions['NOx'].lower)}</td>
            <td>{readableNumber(emissions['NOx'].mean)}</td>
            <td>{readableNumber(emissions['NOx'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>PM 2.5</td>
            <td>{readableNumber(emissions['PM2.5'].lower)}</td>
            <td>{readableNumber(emissions['PM2.5'].mean)}</td>
            <td>{readableNumber(emissions['PM2.5'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>PM 10</td>
            <td>{readableNumber(emissions['PM10'].lower)}</td>
            <td>{readableNumber(emissions['PM10'].mean)}</td>
            <td>{readableNumber(emissions['PM10'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>NH3</td>
            <td>{readableNumber(emissions['NH3'].lower)}</td>
            <td>{readableNumber(emissions['NH3'].mean)}</td>
            <td>{readableNumber(emissions['NH3'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>CO</td>
            <td>{readableNumber(emissions['CO'].lower)}</td>
            <td>{readableNumber(emissions['CO'].mean)}</td>
            <td>{readableNumber(emissions['CO'].upper)}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>SOx</td>
            <td>{readableNumber(emissions['SOx'].lower)}</td>
            <td>{readableNumber(emissions['SOx'].mean)}</td>
            <td>{readableNumber(emissions['SOx'].upper)}</td>
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

export default Emissionemissions;


