
var test = require('tap').test;
var xorshift = require('./xorshift.js');

var reference = require('./reference.json');

function hexview(arr) {
  var a = arr[0].toString(16);
  var b = arr[1].toString(16);

  a = (new Array(9 - a.length)).join(0) + a;
  b = (new Array(9 - b.length)).join(0) + b;

  return (a + b).toUpperCase();
}

test('rand, with seed = [1, 2]', function (t) {
  var rng = new xorshift.constructor([0, 1, 0, 2]);

  for (var i = 0; i < reference.length; i++) {
    t.equal(rng.rand(), parseInt(reference[i], 16) / Math.pow(2, 64));
  }

  t.end();
});

test('randint, with seed = [1, 2]', function (t) {
  var rng = new xorshift.constructor([0, 1, 0, 2]);

  for (var i = 0; i < reference.length; i++) {
    t.strictEqual(hexview(rng.randint()), reference[i]);
  }

  t.end();
});
