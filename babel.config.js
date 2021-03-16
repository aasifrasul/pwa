const config = {
	presets: [
		[
			'@babel/preset-env',
			{
				loose: true,
				modules: false,
			},
		],
		'@babel/preset-react',
		'@babel/preset-typescript',
	],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-transform-modules-commonjs',
		'macros',
	],
	env: {
		test: {
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-transform-modules-commonjs',
				'@babel/plugin-proposal-optional-chaining',
			],
		},
	},
};

module.exports = config;
