#xorshift

[![NPM Package](https://img.shields.io/npm/v/xorshift.svg?style=flat-square)](https://www.npmjs.org/package/xorshift)
[![Build Status](https://img.shields.io/travis/AndreasMadsen/xorshift.svg?branch=master&style=flat-square)](https://travis-ci.org/AndreasMadsen/xorshift)

> Pseudorandom number generator using [xorshift](http://xorshift.di.unimi.it/) (only xorshift128+ available now)

## Installation

```shell
npm install xorshift
```

## Example

```js
var xorshift = require('xorshift');

for (var i = 0; i < 10; i++) {
  console.log(xorshift.random()); // number in range [0, 1)
}
```

## Documentation

This module exports a default pseudo random generator. This generators seed have
already been set (using `Date.now()`). If this is not suitable a custom
generator can be initialized using the constructor function
`xorshift.XorShift128Plus`. In both cases random numbers can be generated using
the methods `.random`, `.randomInt` and `.randomBytes`.

```js
var xorshift = require('xorshift');
```

### xorshift.random()

This method returns a random 64-bit double, with its value in the range [0, 1).
That means 0 is inclusive and 1 is exclusive. This is equivalent to
`Math.random()`.

```js
console.log(xorshift.random()); // number between 0 and 1
```

This method will serve most purposes, for instance to randomly select between
2, 3 and 4, this function can be used:

```js
function uniformint(a, b) {
  return Math.floor(a + xorshift().random() * (b - a));
}

console.log(uniformint(2, 4));
```

### xorshift.randomInt()

This method returns a random 64-bit integer. Since JavaScript doesn't support
64-bit integers, the number is represented as an array with two elements in
big-endian order.

This method is useful if high precision is required, the `xorshift.random()`
method won't allow you to get this precision since a 64-bit IEEE754 double
only contains the 52 most significant bits.

```js
var bview = require('binary-view');
console.log(bview( new Uint32Array(xorshift.randomInt()) ));
```

### xorshift.randomBytes(number size)

This method return `Buffer` with length `size` filled by random bytes.

```js
var buffer = xorshift.randomBytes(32)
console.log(buffer.toString('hex'))
```

### xorshift.XorShift128Plus(Array seed)

This method is used to construct a new random generator, with a specific seed.
This is useful when testing software where random numbers are involved and
getting consistent results is important.

```js
var XorShift128Plus = require('xorshift').XorShift128Plus;
var rng1 = new XorShift128Plus([1, 0, 2, 0]);
var rng2 = new XorShift128Plus([1, 0, 2, 0]);

assert(rng1.random() === rng2.random());
```

In fact the `xorshift` module is an instance of the `XorShift128Plus`.

## Reference

This module implements the xorshift128+ pseudo random number generator.

> This is the fastest generator passing BigCrush without systematic
> errors, but due to the relatively short period it is acceptable only
> for applications with a very mild amount of parallelism; otherwise, use
> a xorshift1024* generator.
> – <cite> http://xorshift.di.unimi.it </cite>

This source also has a
[reference implementation](http://xorshift.di.unimi.it/xorshift128plus.c)
for the xorshift128+ generator. A wrapper around this implementation has been
created and is used for testing this module. To compile and run it:

```shell
gcc -O2 reference.c -o reference
./reference <numbers> <seed0> <seed1>
```

* `<numbers>` can be any number greater than zero, and it will be the number
of random numbers written to `stdout`. The default value is `10`.
* `<seed0>` and `<seed1>` forms the 128bit seed that the algorithm uses. Default
is `[1, 2]`.

## License

MIT
