// @ts-check

/**
 * @param {string} name
 * @returns {string}
 * @private
 */
function _requireResolve(name)
{
	let result;

	try
	{
		const { requireResolveExtra, requireResolveCore } = require('@yarn-tool/require-resolve');

		const paths = [
			requireResolveExtra('@bluelovers/tsdx').result,
			requireResolveExtra('tsdx').result,
		].filter(Boolean);

		result = requireResolveCore(name, {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths,
		})
	}
	catch (e)
	{

	}

	return result || require.resolve(name)
}

const testExt = [
	'ts',
	'tsx',
	//'js',
	//'jsx',
].join('|');

/**
 * @type { import('@jest/types').Config.InitialOptions }
 */
module.exports = {
	clearMocks: true,
	moduleFileExtensions: [
		'ts',
		'tsx',
		'js',
		'jsx',
		'json',
		'node',
	],
	testEnvironment: 'node',
	//testMatch: ['**/*.test.ts', '**/*.spec.ts'],
	testMatch: void 0,
	testRegex: [
		`\\.(tests?|spec)\\.(${testExt})$`,
		`__tests__\/\.*\\.(${testExt})$`,
	],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/__fixtures__/',
		'/fixtures/',
		'/__tests__/helpers/',
		'/__tests__/utils/',
		'__mocks__',
	],
	//testRunner: 'jest-circus/runner',
	setupFilesAfterEnv: [
		//"jest-chain",
		//"jest-extended",
		//"jest-extended-extra",
		//"jest-num-close-with",
	],
	transform: {
		'.(ts|tsx)$': _requireResolve('ts-jest'),
	},
	verbose: true,
	/**
	 * if didn't set `coverageProvider` to `v8`
	 * with `collectCoverage` `true`, nodejs debug point maybe will fail
	 */
	coverageProvider: 'v8',
	collectCoverage: false,
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'**/node_modules/',
		'**/__snapshots__/',
		'**/__tests__/',
	],
	/**
	 * https://github.com/facebook/jest/issues/9771#issuecomment-872764344
	 */
	//resolver: 'jest-node-exports-resolver',
}
