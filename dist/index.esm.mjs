let xorshift;
const XorShift = function XorShift(seed) {
  if (!new.target && (!(this instanceof XorShift) || this === xorshift)) {
    return new XorShift(seed);
  }

  if (!Array.isArray(seed) || seed.length !== 4) {
    throw new TypeError('seed must be an array with 4 numbers');
  }

  this._state0U = seed[0] | 0;
  this._state0L = seed[1] | 0;
  this._state1U = seed[2] | 0;
  this._state1L = seed[3] | 0;
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
  var t2 = this.randomint();
  return t2[0] * 2.3283064365386963e-10 + (t2[1] >>> 12) * 2.220446049250313e-16;
};

function getRandomSeed() {
  return Math.random() * Math.pow(2, 32);
}
xorshift = /*#__PURE__*/new XorShift([/*#__PURE__*/getRandomSeed(), /*#__PURE__*/getRandomSeed(), /*#__PURE__*/getRandomSeed(), /*#__PURE__*/getRandomSeed()]);
xorshift.XorShift = XorShift;
var xorshift$1 = xorshift;

export { XorShift, xorshift$1 as default, getRandomSeed, xorshift };
//# sourceMappingURL=index.esm.mjs.map
