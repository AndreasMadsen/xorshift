var rng = require('../xorshift128plus');

var n = process.argv[2] || 25e7;

var tick = process.hrtime();
while (n--) {
  rng.randomInt();
}
var tock = process.hrtime(tick);

console.log(tock[0] * 1e3 + tock[1] * 1e-6 + 'ms');
