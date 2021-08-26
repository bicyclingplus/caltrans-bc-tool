import React from 'react';

import DemandTableRow4 from './DemandTableRow4';

class VMTReductions extends React.Component {

  render() {

    let benefits = this.props.benefits;

    let tableRows = benefits.map((item) =>
      <DemandTableRow4
            key={item['type']}
            type={item['type']}
            lower={item['lower']}
            mean={item['mean']}
            upper={item['upper']} />
    );

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

