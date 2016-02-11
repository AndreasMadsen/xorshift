'use strict';

var inherits = require('inherits');
var XorShift = require('./xorshift');

/**
 * Create a pseudorandom number generator, with a seed.
 * @class XorShift128Plus
 * @extends XorShift
 * @param {number[]} seed "128-bit" integer,
 *   composed of 4x32-bit integers in big endian order.
 */
function XorShift128Plus (seed) {
  XorShift.call(this);

  if (!(seed && seed.length === 4)) {
    throw new TypeError('seed should have length equal 4');
  }

  // uint64_t s = [seed ...]
  this._s0U = seed[0] | 0;
  this._s0L = seed[1] | 0;
  this._s1U = seed[2] | 0;
  this._s1L = seed[3] | 0;
}

inherits(XorShift128Plus, XorShift);

/**
 * Returns a 64bit random number as a 2x32bit array
 * @return {number[]}
 */
XorShift128Plus.prototype._random = function () {
  // uint64_t s1 = s[0];
  var s1U = this._s0U;
  var s1L = this._s0L;
  // const uint64_t s0 = s[1];
  var s0U = this._s1U;
  var s0L = this._s1L;
  // s[0] = s0;
  this._s0U = s0U;
  this._s0L = s0L;
  // s1 ^= s1 << 23;
  s1U ^= ((s1U & 0x000001ff) << 23) | (s1L >>> 9);
  s1L ^= (s1L & 0x000001ff) << 23;
  // s[1] = s1 ^ s0 ^ (s1 >> 17) ^ (s0 >> 26);
  this._s1U ^= s1U ^ (s1U >>> 17) ^ (s0U >>> 26);
  this._s1L ^= s1L ^ (((s1U & 0x0001ffff) << 15) | (s1L >>> 17)) ^ (((s0U & 0x03ffffff) << 6) | (s0L >>> 26));
  // return s[1] + s0;
  var rL = (this._s1L >>> 0) + (s0L >>> 0);
  return [
    ((this._s1U >>> 0) + (s0U >>> 0) + ((rL / 0x0100000000) | 0)) >>> 0,
    rL >>> 0
  ];
};

module.exports = XorShift128Plus;
