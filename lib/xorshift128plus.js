/**
 * Create a pseudorandom number generator, with a seed.
 * @class XorShift128Plus
 * @param {number[]} seed "128-bit" integer,
 *   composed of 4x32-bit integers in big endian order.
 */
function XorShift128Plus (seed) {
  if (!(seed && seed.length === 4)) {
    throw new TypeError('seed should have length equal 4');
  }

  // uint64_t s = [seed ...]
  this._s0U = seed[0] | 0;
  this._s0L = seed[1] | 0;
  this._s1H = seed[2] | 0;
  this._s1L = seed[3] | 0;
}

/**
 * Returns a 64bit random number as a 2x32bit array
 * @return {number[]}
 */
XorShift128Plus.prototype._random = function () {
  // uint64_t x = s[0];
  var xH = this._s0U;
  var xL = this._s0L;
  // uint64_t const y = s[1];
  var yH = this._s1H;
  var yL = this._s1L;
  // s[0] = y;
  this._s0U = yH;
  this._s0L = yL;
  // x ^= x << 23;
  xH ^= (((xH & 0x000001ff) << 23) + (xL >>> 9));
  xL ^= (xL & 0x000001ff) << 23;
  // s[1] = x ^ y ^ (x >> 17) ^ (y >> 26);
  this._s1H ^= xH ^ (xH >>> 17) ^ (yH >>> 26);
  this._s1L ^= xL ^ (((xH & 0x0001ffff) << 15) + (xL >>> 17)) ^ (((yH & 0x03ffffff) << 6) + (yL >>> 26));
  // return s[1] + y;
  var rL = (this._s1L >>> 0) + (yL >>> 0);
  return [
    ((this._s1H >>> 0) + (yH >>> 0) + ((rL / 0x0100000000) | 0)) >>> 0,
    rL >>> 0
  ];
};

/**
 * Returns a random number normalized [0, 1), just like Math.random()
 * @return {number}
 */
var CONVERTION_BUFFER = new Buffer(8);
XorShift128Plus.prototype.random = function () {
  var s = this._random();
  // first significant 12 bits always is 1, because this,
  //   apply right shift on 12 that drop least significat bits of s
  var xH = 0x3ff00000 + (s[0] >>> 12);
  var xL = ((s[0] & 0x00000fff) << 20) + (s[1] >>> 12);
  CONVERTION_BUFFER.writeUInt32BE(xH, 0, true);
  CONVERTION_BUFFER.writeUInt32BE(xL, 4, true);
  return CONVERTION_BUFFER.readDoubleBE(0, true) - 1;
};

module.exports = XorShift128Plus;
