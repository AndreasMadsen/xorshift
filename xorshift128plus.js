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
  this._s0hi = seed[0] | 0;
  this._s0lo = seed[1] | 0;
  this._s1hi = seed[2] | 0;
  this._s1lo = seed[3] | 0;
}

/**
 * Returns a 64bit random number as a 2x32bit array
 * @return {number[]}
 */
XorShift128Plus.prototype.randomInt = function () {
  // uint64_t x = s[0];
  var xhi = this._s0hi;
  var xlo = this._s0lo;
  // uint64_t const y = s[1];
  var yhi = this._s1hi;
  var ylo = this._s1lo;
  // s[0] = y;
  this._s0hi = yhi;
  this._s0lo = ylo;
  // x ^= x << 23;
  xhi ^= (((xhi & 0x000001ff) << 23) + (xlo >>> 9));
  xlo ^= (xlo & 0x000001ff) << 23;
  // s[1] = x ^ y ^ (x >> 17) ^ (y >> 26);
  this._s1hi = (xhi ^ yhi ^ (xhi >>> 17) ^ (yhi >>> 26)) >>> 0;
  this._s1lo = (xlo ^ ylo ^ (((xhi & 0x0001ffff) << 15) + (xlo >>> 17)) ^ (((yhi & 0x03ffffff) << 6) + (ylo >>> 26))) >>> 0;
  // return s[1] + y;
  return [
    (this._s1hi + yhi + (((this._s1lo + ylo) / 0x0100000000) | 0)) >>> 0,
    (this._s1lo + ylo) >>> 0
  ];
};

/**
 * Returns a random number normalized [0, 1), just like Math.random()
 * @return {number}
 */
var CONVERTION_BUFFER = new Buffer(8);
XorShift128Plus.prototype.random = function () {
  var s = this.randomInt();
  // first 12 bits always is 1, so drop first 12 bits of s
  var xhi = 0x3ff00000 + (s[0] >>> 12);
  var xlo = ((s[0] & 0x00000fff) << 20) + (s[1] >>> 12);
  CONVERTION_BUFFER.writeUInt32BE(xhi, 0, true);
  CONVERTION_BUFFER.writeUInt32BE(xlo, 4, true);
  return CONVERTION_BUFFER.readDoubleBE(0, true) - 1;
};

// There is nothing particularly scientific about this seed,
//   it is just based on the clock.
module.exports = new XorShift128Plus([
  0, Date.now() / 65536,
  0, Date.now() % 65536
]);
module.exports.XorShift128Plus = XorShift128Plus;

// Perform 20 iterations in the RNG,
//   this prevens a short seed from generating pseudo predictable number.
for (var i = 0; i < 20; i++) {
  module.exports.randomInt();
}
