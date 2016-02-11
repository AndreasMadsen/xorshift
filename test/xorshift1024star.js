'use strict';

var tap = require('tap');
var XorShift = require('../lib/xorshift');
var XorShift1024Star = require('../lib/xorshift1024star');

var fixtures = require('./fixtures');

tap.test('XorShift1024Star', function (t) {
  t.test('initialization', function (t) {
    t.test('wrong seed type', function (t) {
      t.throw(function () {
        new XorShift1024Star(null); // eslint-disable-line no-new
      }, new TypeError('seed should have length equal 32'));
      t.end();
    });

    t.test('wrong seed length', function (t) {
      t.throw(function () {
        new XorShift1024Star([1, 2, 0]); // eslint-disable-line no-new
      }, new TypeError('seed should have length equal 32'));
      t.end();
    });

    t.end();
  });

  t.test('inherit XorShift', function (t) {
    var xorshift = new XorShift1024Star(new Array(32));
    t.ok(xorshift instanceof XorShift);
    t.ok(xorshift instanceof XorShift1024Star);
    t.end();
  });

  t.test('_random', function (t) {
    function test (seed, p, count) {
      t.test('with seed: ' + JSON.stringify(seed), function (t) {
        var expected = fixtures.get('xorshift1024star', seed, p, count);

        var xorshift = new XorShift1024Star(seed, p);
        for (var i = 0; i < count; ++i) {
          var data = xorshift._random();
          t.equal(data[0], expected.readUInt32BE(i * 8));
          t.equal(data[1], expected.readUInt32BE(i * 8 + 4));
        }

        t.end();
      });
    }

    var seed = new Array(32);
    for (var i = 0; i < 32; ++i) {
      seed[i] = 1;
    }

    for (var j = 0; j < 32; j += 8) {
      seed[j] = 1e3;
      test(seed, 1, 1000);
    }

    t.end();
  });

  t.end();
});
