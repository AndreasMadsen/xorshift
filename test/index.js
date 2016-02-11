'use strict';

var tap = require('tap');
var xorshift = require('../');
var XorShift = require('../lib/xorshift');
var XorShift128Plus = require('../lib/xorshift128plus');

tap.test('index', function (t) {
  t.test('instance of XorShift', function (t) {
    t.ok(xorshift instanceof XorShift);
    t.end();
  });

  t.test('has XorShift', function (t) {
    t.ok(xorshift.XorShift === XorShift);
    t.end();
  });

  t.test('has XorShift128Plus', function (t) {
    t.ok(xorshift.XorShift128Plus === XorShift128Plus);
    t.end();
  });

  t.end();
});
