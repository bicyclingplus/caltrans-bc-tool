import React from 'react';

import { readableNumber } from '../helpers/formatting';

class Emissions extends React.Component {

  render() {

    let { emissions, vmtReductions, timeframe } = this.props;

    return (
      <>
      <h5 className="mt-4">VMT and Emissions</h5>
      <table className="table table-bordered mb-4">
        <tbody>
          <tr>
            <th></th>
            <th colSpan="3" className="text-center">{timeframe} Year Reductions (Grams)</th>
            <th colSpan="3" className="text-center">{timeframe} Year Reductions / Capita</th>
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
            <td className="text-end">{readableNumber(emissions.reductions['CO2'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['CO2'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['CO2'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>CH4</td>
            <td className="text-end">{readableNumber(emissions.reductions['CH4'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['CH4'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['CH4'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>N2O</td>
            <td className="text-end">{readableNumber(emissions.reductions['N2O'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['N2O'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['N2O'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>Total C02 Equivalent</td>
            <td className="text-end">{readableNumber(emissions.equivalent.lower)}</td>
            <td className="text-end">{readableNumber(emissions.equivalent.mean)}</td>
            <td className="text-end">{readableNumber(emissions.equivalent.upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <th colSpan="7">Air Toxins</th>
          </tr>
          <tr>
            <td>NOx</td>
            <td className="text-end">{readableNumber(emissions.reductions['NOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['NOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['NOx'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>PM 2.5</td>
            <td className="text-end">{readableNumber(emissions.reductions['PM2.5'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['PM2.5'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['PM2.5'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>PM 10</td>
            <td className="text-end">{readableNumber(emissions.reductions['PM10'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['PM10'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['PM10'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>NH3</td>
            <td className="text-end">{readableNumber(emissions.reductions['NH3'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['NH3'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['NH3'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>CO</td>
            <td className="text-end">{readableNumber(emissions.reductions['CO'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['CO'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['CO'].upper)}</td>
            <td className="text-end"></td>
            <td className="text-end"></td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td>SOx</td>
            <td className="text-end">{readableNumber(emissions.reductions['SOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['SOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.reductions['SOx'].upper)}</td>
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


