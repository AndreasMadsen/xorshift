/**
 * @param {number[]} arr
 * @return {string}
 */
module.exports.hexview = function (arr) {
  var a = arr[0].toString(16);
  var b = arr[1].toString(16);

  a = (new Array(9 - a.length)).join(0) + a;
  b = (new Array(9 - b.length)).join(0) + b;

  return (a + b).toUpperCase();
};

/**
 * @param {number} d
 * @return {string}
 */
module.exports.floatview = function (d) {
  // Makes sure that the exponent has two digets like in C-printf
  var s = d.toExponential(20);
  var m = s.match(/^([0-9.]+)e(\+|-)([0-9]+)$/);
  var e = (m[3].length === 1) ? '0' + m[3] : m[3];
  return m[1] + 'e' + m[2] + e;
};
