import React from 'react';

import { readableNumber } from './helpers/formatting';

class DemandTableRow5 extends React.Component {

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

export default DemandTableRow5;
