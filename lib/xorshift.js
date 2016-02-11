'use strict';

/**
 * Basic class for XorShift generators
 * @class XorShift
 */
function XorShift () {
  this._buffer = new Buffer(8);
}

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
  // first significant 12 bits always is 1, because this,
  //   apply right shift on 12 that drop least significat bits of s
  var xH = 0x3ff00000 + (s[0] >>> 12);
  var xL = (((s[0] & 0x00000fff) << 20) | (s[1] >>> 12)) >>> 0;
  this._buffer.writeUInt32BE(xH, 0);
  this._buffer.writeUInt32BE(xL, 4);
  return this._buffer.readDoubleBE(0) - 1;
};

module.exports = XorShift;
