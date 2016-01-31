var test = require('tap').test;
var xorshift = require('../xorshift128plus.js');

var util = require('./util');
var reference = require('../reference/xorshift128plus.json');

test('bad initialization', function (t) {
  t.test('wrong seed type', function (t) {
    t.throw(function () {
      new xorshift.XorShift128Plus(null); // eslint-disable-line no-new
    }, new TypeError('seed should have length equal 4'));
    t.end();
  });

  t.test('wrong seed length', function (t) {
    t.throw(function () {
      new xorshift.XorShift128Plus([1, 2, 0]); // eslint-disable-line no-new
    }, new TypeError('seed should have length equal 4'));
    t.end();
  });

  t.end();
});

test('default instance', function (t) {
  t.test('random int', function (t) {
    // demand that the 1000 first outputs are different
    var obj = Object.create(null);
    for (var i = 0; i < 1000; i++) {
      obj[util.hexview(xorshift.randomInt())] = 1;
    }
    t.equal(Object.keys(obj).length, 1000);
    t.end();
  });

  t.test('random double', function (t) {
    // demand that the 100 first outputs are different
    var obj = Object.create(null);
    for (var i = 0; i < 100; i++) {
      var rand = xorshift.random();
      obj[rand.toExponential(20)] = 1;
      t.ok(rand >= 0 && rand < 1, 'random double is [0, 1)');
    }
    t.equal(Object.keys(obj).length, 100);
    t.end();
  });
  t.end();
});

test('random int array', function (t) {
  t.test('with seed = [1, 2]', function (t) {
    var ref = reference.integer['1-2'];
    var rng = new xorshift.XorShift128Plus([0, 1, 0, 2]);
    for (var i = 0; i < ref.length; i++) {
      t.strictEqual(util.hexview(rng.randomInt()), ref[i]);
    }

    t.end();
  });

  t.test('with seed = [3, 4]', function (t) {
    var ref = reference.integer['3-4'];
    var rng = new xorshift.XorShift128Plus([0, 3, 0, 4]);
    for (var i = 0; i < ref.length; i++) {
      t.strictEqual(util.hexview(rng.randomInt()), ref[i]);
    }

    t.end();
  });

  t.end();
});

test('random double', function (t) {
  t.test('with seed = [1, 2]', function (t) {
    var ref = reference.double['1-2'];
    var rng = new xorshift.XorShift128Plus([0, 1, 0, 2]);
    for (var i = 0; i < ref.length; i++) {
      t.equal(util.floatview(rng.random()), ref[i]);
    }

    t.end();
  });

  t.test('with seed = [3, 4]', function (t) {
    var ref = reference.double['3-4'];
    var rng = new xorshift.XorShift128Plus([0, 3, 0, 4]);
    for (var i = 0; i < ref.length; i++) {
      t.equal(util.floatview(rng.random()), ref[i]);
    }

    t.end();
  });

  t.end();
});
