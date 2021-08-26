import React from 'react';

import DemandTableRow4 from './DemandTableRow4';

class VMTReductions extends React.Component {

  render() {

    let benefits = this.props.benefits;

    let tableRows = [];

    for(const type in benefits) {

      let benefit = benefits[type];

      tableRows.push(
        <DemandTableRow4
          key={type}
          type={type}
          lower={benefit['lower']}
          mean={benefit['mean']}
          upper={benefit['upper']} />
      )
    }

    return (
      <>
      <h5>VMT Reductions</h5>
      <table className="table mb-4">
        <thead>
          <tr>
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

export default VMTReductions;

