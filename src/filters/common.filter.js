////////////
// FILTER //
////////////

export function dateFormat() {
  return function(date, format) {

    if (!date) return '';

    var f = format || 'DD MMMM YYYY, HH:mm';
    var m = Moment(date);
    if (!m.isValid()) return '';

    return m.format(f);
  };
}


export function boolChoice() {
  return function(input, test, trueValue, falseValue) {
    return (input === test) ? trueValue : falseValue;
  };
}
