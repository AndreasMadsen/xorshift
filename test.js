
var os = require('os');
var test = require('tap').test;
var xorshift = require('xorshift');

var reference = require('./reference.json');

function hexview(arr) {
  var a = arr[0].toString(16);
  var b = arr[1].toString(16);

  a = (new Array(9 - a.length)).join(0) + a;
  b = (new Array(9 - b.length)).join(0) + b;

  return (a + b).toUpperCase();
}

test('state [1, 2]', function (t) {
  for (var i = 0; i < reference.length; i++) {
    t.strictEqual(hexview(xorshift()), reference[i]);
  }

  t.end();
});
