'use strict';

var tap = require('tap');
var XorShift = require('../lib/xorshift');
var XorShift128Plus = require('../lib/xorshift128plus');

var fixtures = require('./fixtures')

tap.test('XorShift128Plus', function (t) {
  t.test('initialization', function (t) {
    t.test('wrong seed type', function (t) {
      t.throw(function () {
        new XorShift128Plus(null); // eslint-disable-line no-new
      }, new TypeError('seed should have length equal 4'));
      t.end();
    });

    t.test('wrong seed length', function (t) {
      t.throw(function () {
        new XorShift128Plus([1, 2, 0]); // eslint-disable-line no-new
      }, new TypeError('seed should have length equal 4'));
      t.end();
    });

    t.end();
  });

  t.test('inherit XorShift', function (t) {
    var xorshift = new XorShift128Plus([0, 0, 0, 0]);
    t.ok(xorshift instanceof XorShift);
    t.ok(xorshift instanceof XorShift128Plus);
    t.end();
  });

  t.test('_random', function (t) {
    function test (seed, count) {
      t.test('with seed: ' + JSON.stringify(seed), function (t) {
        var expected = fixtures.get('xorshift128plus', seed, null, count);

        var xorshift = new XorShift128Plus(seed);
        for (var i = 0; i < count; ++i) {
          var data = xorshift._random();
          t.equal(data[0], expected.readUInt32BE(i * 8));
          t.equal(data[1], expected.readUInt32BE(i * 8 + 4));
        }

        t.end();
      });
    }

    test([1, 1, 1, 1], 1000);
    test([1, 1, 1, 1e3], 1000);
    test([1, 1, 1e3, 1e3], 1000);
    test([1, 1e3, 1e3, 1e3], 1000);
    test([1e3, 1e3, 1e3, 1e3], 1000);

    t.end();
  });

  t.end();
});
