'use strict';

var inherits = require('inherits');
var XorShift = require('./xorshift');

/**
 * Create a pseudorandom number generator, with a seed.
 * @class XorShift1024Star
 * @extends XorShift
 * @param {number[]} seed "1024-bit" integer,
 *   composed of 32x32-bit integers in big endian order.
 * @param {number} p
 */
function XorShift1024Star (seed, p) {
  XorShift.call(this);

  if (!(seed && seed.length === 32)) {
    throw new TypeError('seed should have length equal 32');
  }

  this._s = new Array(16);
  for (var i = 0; i < 16; ++i) {
    this._s[i] = { U: seed[i * 2] | 0, L: seed[i * 2 + 1] | 0 };
  }

  this._p = p & 0x0f;
}

inherits(XorShift1024Star, XorShift);

/**
 * Returns a 64bit random number as a 2x32bit array
 * @return {number[]}
 */
XorShift1024Star.prototype._random = function () {
  var s = this._s;
  var p = this._p;
  // const uint64_t s0 = s[p];
  var s0U = s[p].U;
  var s0L = s[p].L;
  // uint64_t s1 = s[p = (p + 1) & 15];
  p = this._p = (p + 1) & 0x0f;
  var s1U = s[p].U;
  var s1L = s[p].L;
  // s1 ^= s1 << 31;
  s1U ^= (((s1U & 0x00000001) << 31) | (s1L >>> 1));
  s1L ^= (s1L & 0x00000001) << 31;
  // s[p] = s1 ^ s0 ^ (s1 >> 11) ^ (s0 >> 30);
  s[p].U = (s1U ^ s0U ^ (s1U >>> 11) ^ (s0U >>> 30)) >>> 0;
  s[p].L = (s1L ^ s0L ^ (((s1U & 0x000007ff) << 21) | (s1L >>> 11)) ^ (((s0U & 0x3fffffff) << 2) | (s0L >>> 30))) >>> 0;
  // return s[p] * UINT64_C(1181783497276652981); 0x106689d45497fdb5
  var w0 = s[p].L & 0x00ffffff;
  var w1 = ((s[p].U & 0x0000ffff) << 8) + (s[p].L >>> 24);
  var w2 = s[p].U >>> 16;
  var r0 = w0 * 0x97fdb5;
  var r1 = ((r0 / 0x01000000) | 0) + w0 * 0x89d454 + w1 * 0x97fdb5;
  var r2 = ((r1 / 0x01000000) | 0) + w0 * 0x1066 + w1 * 0x89d454 + w2 * 0x97fdb5;
  return [
    ((r2 & 0x0000ffff) << 16 | ((r1 & 0x00ffff00) >>> 8)) >>> 0,
    (((r1 & 0x000000ff) << 24) | (r0 & 0x00ffffff)) >>> 0
  ];
};

module.exports = XorShift1024Star;
