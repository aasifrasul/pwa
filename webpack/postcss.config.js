module.exports = {
	plugins: [
		require('postcss-import')({
			path: [__dirname, './styles'],
		}),
		require('postcss-for'),
		require('postcss-random'),
		require('postcss-nested'),
		require('postcss-mixins'),
		require('postcss-simple-vars'),
		require('postcss-cssnext')({
			browsers: [
				'Chrome > 27',
				'android >= 4.0',
				'iOS >= 4.1',
				'Firefox >= 31',
				'UCAndroid >= 9',
				'Edge >= 13',
				'ie_mob > 10',
			],
			url: false,
		}),
	],
};
