'use strict';

var tap = require('tap');
var xorshift = require('../');
var util = require('../util');

tap.test('index', function (t) {
  t.test('randomInt64 should return data from _random', function (t) {
    var data = xorshift._random();
    var prng = { _random: function () { return data; } };
    t.same(util.randomInt64(prng), { U: data[0], L: data[1] });
    t.end();
  });

  t.test('randomBytes with size = 15', function (t) {
    var data = [xorshift._random(), xorshift._random()];
    var prng = {
      count: 0,
      _random: function () {
        return data[this.count++];
      }
    };

    var bytes = util.randomBytes(prng, 15);
    t.equal(bytes.readUInt32BE(0, true), data[0][0]);
    t.equal(bytes.readUInt32BE(4, true), data[0][1]);
    t.equal(bytes.readUInt32BE(8, true), data[1][0]);
    t.equal(bytes.readUInt32BE(12, true), (data[1][1] & 0xffffff00) >>> 0);

    t.end();
  });

  t.end();
});
