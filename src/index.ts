
export type ISeed = [number, number, number, number] | readonly [number, number, number, number];
export type ISeedLooser = ISeed | number[] | readonly number[];

interface IXorShiftConstructor
{
  (seed: ISeedLooser): XorShift
  new (seed: ISeedLooser): XorShift
}

export interface XorShift
{
  _state0U: number
  _state0L: number
  _state1U: number
  _state1L: number

  /**
 * Returns a 64bit random number as a 2x32bit array
 * @return {array}
 */
  randomint(): [number, number]
  /**
 * Returns a random number normalized [0, 1), just like Math.random()
 * @return {number}
 */
  random(): number
}

let xorshift: XorShift & {
  /**
   * Create a pseudorandom number generator, with a seed.
   * @param {array} seed "128-bit" integer, composed of 4x32-bit
   * integers in big endian order.
   */
  XorShift(seed: ISeedLooser): XorShift
  /**
   * Create a pseudorandom number generator, with a seed.
   * @param {array} seed "128-bit" integer, composed of 4x32-bit
   * integers in big endian order.
   *
   * @alias XorShift
   */
  constructor(seed: ISeedLooser): XorShift
};

export function notSeed(seed: ISeedLooser): seed is ISeed
{
  return (!Array.isArray(seed) || seed.length < 4 || seed.some((n, i) => i < 4 && typeof n !== 'number'))
}

export function assertSeed(seed: ISeedLooser): asserts seed is ISeed
{
  if (notSeed(seed)) {
    throw new TypeError(`seed must be an array with 4 numbers: ${seed}`);
  }
}

export function handleSeed(seed: ISeedLooser): ISeed
{
  return [
    seed[0] | 0,
    seed[1] | 0,
    seed[2] | 0,
    seed[3] | 0,
  ]
}

/**
 * Create a pseudorandom number generator, with a seed.
 * @param {array} seed "128-bit" integer, composed of 4x32-bit
 * integers in big endian order.
 */
export const XorShift: IXorShiftConstructor = function XorShift(this: XorShift, seed: ISeedLooser) {
  // Note the extension, this === module.exports is required because
  // the `constructor` function will be used to generate new instances.
  // In that case `this` will point to the default RNG, and `this` will
  // be an instance of XorShift.

  if (!new.target && (!(this instanceof XorShift) || this === xorshift)) {
    // @ts-ignore
    return new XorShift(seed);
  }

  assertSeed(seed);

  // uint64_t s = [seed ...]
  ([this._state0U, this._state0L, this._state1U, this._state1L] = handleSeed(seed));

} as any

/**
 * Returns a 64bit random number as a 2x32bit array
 * @return {array}
 */
XorShift.prototype.randomint = function(this: XorShift) {
  // uint64_t s1 = s[0]
  let s1U = this._state0U, s1L = this._state0L;
  // uint64_t s0 = s[1]
  const s0U = this._state1U, s0L = this._state1L;

  // result = s0 + s1
  const sumL = (s0L >>> 0) + (s1L >>> 0);
  const resU = (s0U + s1U + (sumL / 2 >>> 31)) >>> 0;
  const resL = sumL >>> 0;

  // s[0] = s0
  this._state0U = s0U;
  this._state0L = s0L;

  // - t1 = [0, 0]
  let t1U = 0, t1L = 0;
  // - t2 = [0, 0]
  let t2U = 0, t2L = 0;

  // s1 ^= s1 << 23;
  // :: t1 = s1 << 23
  const a1 = 23;
  const m1 = 0xFFFFFFFF << (32 - a1);
  t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
  t1L = s1L << a1;
  // :: s1 = s1 ^ t1
  s1U = s1U ^ t1U;
  s1L = s1L ^ t1L;

  // t1 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
  // :: t1 = s1 ^ s0
  t1U = s1U ^ s0U;
  t1L = s1L ^ s0L;
  // :: t2 = s1 >> 18
  const a2 = 18;
  const m2 = 0xFFFFFFFF >>> (32 - a2);
  t2U = s1U >>> a2;
  t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
  // :: t1 = t1 ^ t2
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;
  // :: t2 = s0 >> 5
  const a3 = 5;
  const m3 = 0xFFFFFFFF >>> (32 - a3);
  t2U = s0U >>> a3;
  t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
  // :: t1 = t1 ^ t2
  t1U = t1U ^ t2U;
  t1L = t1L ^ t2L;

  // s[1] = t1
  this._state1U = t1U;
  this._state1L = t1L;

  // return result
  return [resU, resL];
};

/**
 * Returns a random number normalized [0, 1), just like Math.random()
 * @return {number}
 */
XorShift.prototype.random = function(this: XorShift) {
  const t2 = this.randomint();
  // Math.pow(2, -32) = 2.3283064365386963e-10
  // Math.pow(2, -52) = 2.220446049250313e-16
  return t2[0] * 2.3283064365386963e-10 + (t2[1] >>> 12) * 2.220446049250313e-16;
};

/**
 * Seed with Math.random() by default to prevent seed collision
 */
export function getRandomSeedEntry() {
    return Math.random() * Math.pow(2, 32);
}

export function getRandomSeedAuto(seed?: ISeedLooser)
{
  seed ??= [];
  // @ts-ignore
  seed[0] ??= getRandomSeedEntry();
  // @ts-ignore
  seed[1] ??= getRandomSeedEntry();
  // @ts-ignore
  seed[2] ??= getRandomSeedEntry();
  // @ts-ignore
  seed[3] ??= getRandomSeedEntry();

  assertSeed(seed);

  return seed
}

xorshift = new XorShift(getRandomSeedAuto()) as any

// @ts-ignore
xorshift.XorShift = XorShift;

export { xorshift }

export default xorshift;
