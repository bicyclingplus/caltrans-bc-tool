import React from 'react';

import DemandTableRow5 from './DemandTableRow5';

class DemandSplitTable extends React.Component {

  render() {

    let benefits = this.props.benefits;

    let tableRows = benefits.map((item) =>
      <DemandTableRow5
        key={item['shortname']+"-"+item['shorttype']}
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

export default DemandSplitTable;
