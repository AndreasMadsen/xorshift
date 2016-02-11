'use strict';

var tap = require('tap');
var XorShift = require('../lib/xorshift');

tap.test('XorShift', function (t) {
  var xorshift;
  var buffer = new Buffer(8);

  t.beforeEach(function (done) {
    xorshift = new XorShift();
    done();
  });

  t.test('should use _random', function (t) {
    t.throws(function () {
      xorshift.random();
    }, 'Not implemented!');
    t.end();
  });

  t.test('random should drop 12 bits', function (t) {
    xorshift._random = function () { return [ 0xffffffff, 0xffffffff ]; };
    buffer.writeDoubleBE(xorshift.random() + 1, 0);
    t.equal(buffer.readUInt32BE(0), 0x3fffffff);
    t.equal(buffer.readUInt32BE(4), 0xffffffff);
    t.end();
  });

  t.test('random should drop least 12 bits', function (t) {
    xorshift._random = function () { return [ 0xffffffff, 0xfffff000 ]; };
    buffer.writeDoubleBE(xorshift.random() + 1, 0);
    t.equal(buffer.readUInt32BE(0), 0x3fffffff);
    t.equal(buffer.readUInt32BE(4), 0xffffffff);
    t.end();
  });

  t.end();
});
