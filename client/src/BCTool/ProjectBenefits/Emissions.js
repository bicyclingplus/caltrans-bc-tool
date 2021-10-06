import React from 'react';

import { readableNumber } from '../helpers/formatting';

class Emissions extends React.Component {

  render() {

    let emissions = this.props.emissions;
    let vmtReductions = this.props.vmtReductions;

    return (
      <>
      <h5>5/6) VMT Reductions / Emission Benefits</h5>
      <table className="table table-bordered mb-4">
        <tbody>
          <tr>
            <th></th>
            <th colSpan="3" className="text-center">Annual Reduction</th>
            <th colSpan="3" className="text-center">Annual Reduction / Capita</th>
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
          <tr>
            <td>Vehicle Miles Traveled</td>
            <td className="text-end">{readableNumber(vmtReductions.lower)}</td>
            <td className="text-end">{readableNumber(vmtReductions.mean)}</td>
            <td className="text-end">{readableNumber(vmtReductions.upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td colSpan="7" className="text-center">In-use Emission Reductions (units)</td>
          </tr>
          <tr>
            <th colSpan="7">Greenhouse Gasses</th>
          </tr>
          <tr>
            <td>CO2</td>
            <td className="text-end">{readableNumber(emissions['CO2'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['CO2'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['CO2'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>CH4</td>
            <td className="text-end">{readableNumber(emissions['CH4'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['CH4'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['CH4'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>N2O</td>
            <td className="text-end">{readableNumber(emissions['N2O'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['N2O'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['N2O'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <th colSpan="7">Air Toxins</th>
          </tr>
          <tr>
            <td>NOx</td>
            <td className="text-end">{readableNumber(emissions['NOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['NOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['NOx'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>PM 2.5</td>
            <td className="text-end">{readableNumber(emissions['PM2.5'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['PM2.5'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['PM2.5'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>PM 10</td>
            <td className="text-end">{readableNumber(emissions['PM10'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['PM10'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['PM10'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>NH3</td>
            <td className="text-end">{readableNumber(emissions['NH3'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['NH3'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['NH3'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>CO</td>
            <td className="text-end">{readableNumber(emissions['CO'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['CO'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['CO'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>SOx</td>
            <td className="text-end">{readableNumber(emissions['SOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions['SOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions['SOx'].upper)}</td>
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

export default Emissions;


