export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function readableNumber(number, places = 0, suffix = '') {

  if(Number.isNaN(number)) {
    return "N/A";
  }

  if(number === null) {
    return "N/A";
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

  let factor = Math.pow(10, 3);

  if(number < 1) {
    return numberWithCommas(Math.round((number + Number.EPSILON) * factor) / factor) + suffix;
  }

  return numberWithCommas(Math.round((number + Number.EPSILON))) + suffix;

}