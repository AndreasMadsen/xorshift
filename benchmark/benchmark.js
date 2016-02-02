var benchmark = require('benchmark');
var xorshift = require('../');

benchmark.options.minTime = 1;

/**
 * @param {{rng: function}} rng
 * @return {function}
 */
function getBenchmarkFunction (rng) {
  return function () {
    rng.randomInt();
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
.add('xorshift128+', getBenchmarkFunction(new xorshift.XorShift128Plus([0, 1, 0, 2])))
.run();
