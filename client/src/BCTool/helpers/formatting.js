export function readableNumber(number) {

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