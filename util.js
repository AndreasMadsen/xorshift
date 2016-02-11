'use strict';

/**
 * @param {XorShift} prng
 * @return {U: number, L: number}
 */
exports.randomInt64 = function randomInt64 (prng) {
  var data = prng._random();
  return {U: data[0], L: data[1]};
};

/**
 * @param {XorShift} prng
 * @param {number} size
 * @return {Buffer}
 */
exports.randomBytes = function randomBytes (prng, size) {
  var buffer = new Buffer(size);
  for (var offset = 0; offset < size; offset += 8) {
    var s = prng._random();
    buffer.writeUInt32BE(s[0], offset, true);
    buffer.writeUInt32BE(s[1], offset + 4, true);
  }
  return buffer;
};
