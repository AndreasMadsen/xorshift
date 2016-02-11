'use strict';

var tap = require('tap');
var xorshift = require('../');
var XorShift = require('../lib/xorshift');
var XorShift128Plus = require('../lib/xorshift128plus');
var XorShift1024Star = require('../lib/xorshift1024star');

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

  t.test('has XorShift1024Star', function (t) {
    t.ok(xorshift.XorShift1024Star === XorShift1024Star);
    t.end();
  });

  t.end();
});
