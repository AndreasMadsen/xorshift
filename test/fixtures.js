'use strict';

var path = require('path');
var spawnSync = require('child_process').spawnSync;

/**
 * @param {string} algo
 * @param {number[]} seed
 * @param {?number} p
 * @param {number} count
 * @return {Buffer}
 */
exports.get = function get (algo, seed, p, count) {
  var args = [algo];

  var buffer = new Buffer(8);
  for (var i = 0; i < seed.length; i += 2) {
    buffer.writeUInt32BE(seed[i], 0);
    buffer.writeUInt32BE(seed[i + 1], 4);
    args.push(buffer.toString('hex'));
  }

  if (p) {
    args.push(p.toString(10));
  }

  args.push(count.toString(10));

  var data = spawnSync(path.join(__dirname, 'xorshift'), args);
  if (data.error) {
    throw data.error;
  }

  return new Buffer(data.stdout.toString().slice(0, -1), 'hex'); // cut \n
};
