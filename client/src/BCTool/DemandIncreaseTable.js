import React from 'react';

import DemandTableRow5 from './DemandTableRow5';

class DemandIncreaseTable extends React.Component {

  render() {

    let benefits = this.props.benefits;

    let tableRows = [];

    for(const element in benefits) {

      for(const type in benefits[element]) {

        let benefit = benefits[element][type];

        tableRows.push(
          <DemandTableRow5
            key={benefit['name']+"-"+type}
            element={benefit['name']}
            type={type}
            lower={benefit['lower']}
            mean={benefit['mean']}
            upper={benefit['upper']} />
        )
      }
    }

    return (
      <>
      <h5>Demand Increase</h5>
      <table className="table mb-4">
        <thead>
          <tr>
            <th scope="col">Infrastructure Element</th>
            <th scope="col">Type</th>
            <th scope="col">Lower</th>
            <th scope="col">Mean</th>
            <th scope="col">Upper</th>
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

export default DemandIncreaseTable;
