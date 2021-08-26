import React from 'react';

import DemandTableRow from './DemandTableRow';

class DemandSplitTable extends React.Component {

  render() {

    let benefits = this.props.benefits;

    let tableRows = benefits.map((item) =>
      <DemandTableRow
        key={item['name']+"-"+item['type']}
        element={item['name']}
        type={item['type']}
        lower={item['lower']}
        mean={item['mean']}
        upper={item['upper']}
      />
    );

    return (
      <>
      <h5>Demand Split</h5>
      <table className="table">
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

export default DemandSplitTable;
