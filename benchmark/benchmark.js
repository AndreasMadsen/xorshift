var benchmark = require('benchmark');
var xorshift = require('../');

benchmark.options.minTime = 1;

var seed = new Array(32);
for (var i = 0; i < seed.length; ++i) {
  seed[i] = (Math.random() * 100) | 0
}

/**
 * @param {{rng: function}} rng
 * @return {function}
 */
function getBenchmarkFunction (rng) {
  return function () {
    rng.random();
  };
}

new benchmark.Suite({
  onStart: function () {
    console.log('--------------------------------------------------');
  },
  onCycle: function (event) {
    console.log(String(event.target));
  },
  onComplete: function () {
    console.log('==================================================');
  }
})
.add('xorshift128+', getBenchmarkFunction(new xorshift.XorShift128Plus(seed.slice(0, 4))))
.add('xorshift1024*', getBenchmarkFunction(new xorshift.XorShift1024Star(seed, 1)))
.run();
