import React from 'react';

function readableNumber(number) {

  if(number === null) {
    return "-";
  }
  else if(number === 0) {
    return "No change";
  }
  else if(number > 0) {
    return (
      <span className="positive-change">{"+" + Math.round(number)}</span>
    );
  }
  else {
    return (
      <span className="negative-change">{Math.round(number)}</span>
    );
  }

}

class DemandIncreaseRow extends React.Component {

  render() {

    let element = this.props.element;
    let type = this.props.type;
    let lower = readableNumber(this.props.lower);
    let mean = readableNumber(this.props.mean);
    let upper = readableNumber(this.props.upper);

    return (
      <tr>
        <td>{element}</td>
        <td>{type}</td>
        <td>{lower}</td>
        <td>{mean}</td>
        <td>{upper}</td>
      </tr>
    );
  }

}

class DemandIncreaseTable extends React.Component {

  render() {

    let benefits = this.props.benefits;

    let tableRows = [];

    for(const element in benefits) {

      for(const type in benefits[element]) {

        let benefit = benefits[element][type];

        tableRows.push(
          <DemandIncreaseRow
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

export default DemandIncreaseTable;
