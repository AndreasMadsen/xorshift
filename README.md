#xorshift

[![NPM Package](https://img.shields.io/npm/v/xorshift.svg?style=flat-square)](https://www.npmjs.org/package/xorshift)
[![Build Status](https://img.shields.io/travis/AndreasMadsen/xorshift.svg?branch=master&style=flat-square)](https://travis-ci.org/AndreasMadsen/xorshift)

> Pseudorandom number generator using [xorshift](http://xorshift.di.unimi.it/) (available xorshift128+ and xorshift1024*)

## Installation

```shell
npm install xorshift
```

## Example

```javascript
var xorshift = require('xorshift');

for (var i = 0; i < 10; i++) {
  console.log(xorshift.random()); // number in range [0, 1)
}
```

## Documentation

This module exports a default PRNG. This generators seed have already been set (using `Date.now()`).
If this is not suitable a custom generator can be initialized using the function `xorshift.XorShift128Plus` or `xorshift.XorShift1024Star`.

```javascript
var xorshift = require('xorshift');
```

#### XorShift128Plus(Array seed)

This method is used to construct a new PRNG, with a specific seed.
This is useful when testing software where random numbers are involved and getting consistent results is important.

```javascript
var XorShift128Plus = require('xorshift').XorShift128Plus;
var prng1 = new XorShift128Plus([1, 0, 2, 0]);
var prng2 = new XorShift128Plus([1, 0, 2, 0]);

assert(prng1.random() === prng2.random());
```

#### XorShift1024Star(Array seed, number p)

Another xorshift PRNG with longer period (2**1024 - 1), but slower.

```javascript
var XorShift128Plus = require('xorshift').XorShift128Plus;
var seed = [ 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
             0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
var prng1 = new XorShift1024Star(seed, 1);
var prng2 = new XorShift1024Star(seed, 1);

assert(prng1.random() === prng2.random());
```

#### random()

This method returns a random 64-bit double, with its value in the range [0, 1).
That means 0 is inclusive and 1 is exclusive. This is equivalent to
`Math.random()`.

```javascript
console.log(xorshift.random()); // number between 0 and 1
```

This method will serve most purposes, for instance to randomly select between
2, 3 and 4, this function can be used:

```javascript
function uniformint(a, b) {
  return Math.floor(a + xorshift().random() * (b - a));
}

console.log(uniformint(2, 4));
```

#### randomInt64(XorShift prng)

This method returns a random 64-bit integer. Since JavaScript doesn't support
64-bit integers, the number is represented as an array with two elements in
big-endian order.

This method is useful if high precision is required, the `xorshift.random()`
method won't allow you to get this precision since a 64-bit IEEE754 double
only contains the 52 most significant bits.

```javascript
var bview = require('binary-view');
var xorshiftUtil = require('xorshift/util');
console.log(bview( new Uint32Array(xorshiftUtil.randomInt64(xorshift)) ));
```

#### randomBytes(XorShift prng, number size)

This method return `Buffer` with length `size` filled by random bytes.

```javascript
var xorshiftUtil = require('xorshift/util');
var buffer = xorshiftUtil.randomBytes(xorshift, 32)
console.log(buffer.toString('hex'))
```

## License

MIT
