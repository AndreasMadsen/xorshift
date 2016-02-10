var XorShift128Plus = require('./lib/xorshift128plus');

// There is nothing particularly scientific about this seed,
//   it is just based on the clock.
var rng = new XorShift128Plus([
  0, Date.now() / 65536,
  0, Date.now() % 65536
]);

// Perform 20 iterations in the RNG,
//   this prevens a short seed from generating pseudo predictable number.
for (var i = 0; i < 20; i++) {
  rng._random();
}

module.exports = rng;
module.exports.XorShift128Plus = XorShift128Plus;
