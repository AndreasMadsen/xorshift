export declare type ISeed = [
	number,
	number,
	number,
	number
] | readonly [
	number,
	number,
	number,
	number
];
export declare type ISeedLooser = ISeed | number[] | readonly number[];
export interface IXorShiftConstructor {
	(seed: ISeedLooser): XorShift;
	new (seed: ISeedLooser): XorShift;
}
export interface XorShift {
	_state0U: number;
	_state0L: number;
	_state1U: number;
	_state1L: number;
	/**
   * Returns a 64bit random number as a 2x32bit array
   * @return {array}
   */
	randomint(): [
		number,
		number
	];
	/**
   * Returns a random number normalized [0, 1), just like Math.random()
   * @return {number}
   */
	random(): number;
}
export declare let xorshift: XorShift & {
	/**
	 * Create a pseudorandom number generator, with a seed.
	 * @param {array} seed "128-bit" integer, composed of 4x32-bit
	 * integers in big endian order.
	 */
	XorShift(seed: ISeedLooser): XorShift;
	/**
	 * Create a pseudorandom number generator, with a seed.
	 * @param {array} seed "128-bit" integer, composed of 4x32-bit
	 * integers in big endian order.
	 *
	 * @alias XorShift
	 */
	constructor(seed: ISeedLooser): XorShift;
};
export declare function notSeed(seed: ISeedLooser): seed is ISeed;
export declare function assertSeed(seed: ISeedLooser): asserts seed is ISeed;
export declare function handleSeed(seed: ISeedLooser): ISeed;
/**
 * Create a pseudorandom number generator, with a seed.
 * @param {array} seed "128-bit" integer, composed of 4x32-bit
 * integers in big endian order.
 */
export declare const XorShift: IXorShiftConstructor;
/**
 * Seed with Math.random() by default to prevent seed collision
 */
export declare function getRandomSeedEntry(): number;
export declare function getRandomSeedAuto(seed?: ISeedLooser): ISeed;
export default xorshift;

export {};
