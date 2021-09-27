export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function readableNumber(number) {

  if(number === null) {
    return "-";
  }
  // else if(number === 0) {
  //   return "No change";
  // }
  // else if(number > 0) {
  //   return (
  //     <span className="positive-change">{"+" + numberWithCommas(Math.round(number))}</span>
  //   );
  // }
  // else {
  //   return (
  //     <span className="negative-change">{numberWithCommas(Math.round(number))}</span>
  //   );
  // }

  return numberWithCommas(Math.round(number + Number.EPSILON));

}