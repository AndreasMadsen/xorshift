'use strict';

/**
 * Basic class for XorShift generators
 * @class XorShift
 */
function XorShift () {}

/**
 * Returns a 64bit random number as a 2x32bit array
 * @return {number[]}
 */
XorShift.prototype._random = function () {
  throw new Error('Not implemented!');
};

/**
 * Returns a random number normalized [0, 1), just like Math.random()
 * @return {number}
 */
XorShift.prototype.random = function () {
  var s = this._random();
  var t1 = (s[0] & 0xf0000000) >>> 28;
  var t2 = t1 * 256 + ((s[0] & 0x0ff00000) >>> 20);
  var t3 = t2 * 256 + ((s[0] & 0x000ff000) >>> 12);
  var t4 = t3 * 256 + ((s[0] & 0x00000ff0) >>> 4);
  var t5 = t4 * 256 + (((s[0] & 0x0000000f) << 4) + ((s[1] & 0xf0000000) >>> 28));
  var t6 = t5 * 256 + ((s[1] & 0x0ff00000) >>> 20);
  var t7 = t6 * 256 + ((s[1] & 0x000ff000) >>> 12);
  return t7 * Math.pow(2, -52);
};

module.exports = XorShift;
