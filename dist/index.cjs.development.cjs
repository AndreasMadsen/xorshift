'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

exports.xorshift = void 0;
function notSeed(seed) {
  return !Array.isArray(seed) || seed.length < 4 || seed.some((n, i) => i < 4 && typeof n !== 'number');
}
function assertSeed(seed) {
  if (notSeed(seed)) {
    throw new TypeError(`seed must be an array with 4 numbers: ${seed}`);
  }
}
function handleSeed(seed) {
  return [seed[0] | 0, seed[1] | 0, seed[2] | 0, seed[3] | 0];
}
const XorShift = function XorShift(seed) {
  if (!new.target && (!(this instanceof XorShift) || this === exports.xorshift)) {
    return new XorShift(seed);
  }

  assertSeed(seed);
  [this._state0U, this._state0L, this._state1U, this._state1L] = handleSeed(seed);
};

XorShift.prototype.randomint = function () {
  let s1U = this._state0U,
      s1L = this._state0L;
  const s0U = this._state1U,
        s0L = this._state1L;
  const sumL = (s0L >>> 0) + (s1L >>> 0);
  const resU = s0U + s1U + (sumL / 2 >>> 31) >>> 0;
  const resL = sumL >>> 0;
  this._state0U = s0U;
  this._state0L = s0L;
  let t1U = 0,
      t1L = 0;
  let t2U = 0,
      t2L = 0;
  const a1 = 23;
  const m1 = 0xFFFFFFFF << 32 - a1;
  t1U = s1U << a1 | (s1L & m1) >>> 32 - a1;
  t1L = s1L << a1;
  s1U = s1U ^ t1U;
  s1L = s1L ^ t1L;
  t1U = s1U ^ s0U;
  t1L = s1L ^ s0L;
  const a2 = 18;
  const m2 = 0xFFFFFFFF >>> 32 - a2;
  t2U = s1U >>> a2;
  t2L = s1L >>> a2 | (s1U & m2) << 32 - a2;
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;
  const a3 = 5;
  const m3 = 0xFFFFFFFF >>> 32 - a3;
  t2U = s0U >>> a3;
  t2L = s0L >>> a3 | (s0U & m3) << 32 - a3;
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;
  this._state1U = t1U;
  this._state1L = t1L;
  return [resU, resL];
};

XorShift.prototype.random = function () {
  const t2 = this.randomint();
  return t2[0] * 2.3283064365386963e-10 + (t2[1] >>> 12) * 2.220446049250313e-16;
};

function getRandomSeedEntry() {
  return Math.random() * Math.pow(2, 32);
}
function getRandomSeedAuto(seed) {
  var _seed, _seed2, _, _seed2$_, _seed3, _2, _seed3$_, _seed4, _3, _seed4$_, _seed5, _4, _seed5$_;

  (_seed = seed) !== null && _seed !== void 0 ? _seed : seed = [];
  (_seed2$_ = (_seed2 = seed)[_ = 0]) !== null && _seed2$_ !== void 0 ? _seed2$_ : _seed2[_] = getRandomSeedEntry();
  (_seed3$_ = (_seed3 = seed)[_2 = 1]) !== null && _seed3$_ !== void 0 ? _seed3$_ : _seed3[_2] = getRandomSeedEntry();
  (_seed4$_ = (_seed4 = seed)[_3 = 2]) !== null && _seed4$_ !== void 0 ? _seed4$_ : _seed4[_3] = getRandomSeedEntry();
  (_seed5$_ = (_seed5 = seed)[_4 = 3]) !== null && _seed5$_ !== void 0 ? _seed5$_ : _seed5[_4] = getRandomSeedEntry();
  assertSeed(seed);
  return seed;
}
exports.xorshift = /*#__PURE__*/new XorShift( /*#__PURE__*/getRandomSeedAuto());
exports.xorshift.XorShift = XorShift;
var xorshift = exports.xorshift;

exports.XorShift = XorShift;
exports.assertSeed = assertSeed;
exports["default"] = xorshift;
exports.getRandomSeedAuto = getRandomSeedAuto;
exports.getRandomSeedEntry = getRandomSeedEntry;
exports.handleSeed = handleSeed;
exports.notSeed = notSeed;
//# sourceMappingURL=index.cjs.development.cjs.map
