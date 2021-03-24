const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const paths = require('./paths');
var webpackCommonConfig = require('../webpack/webpack.common');
const fs = require('fs');
const LOADERS = require('../webpack/loaders');
const PLUGINS = require('../webpack/plugins');
const isProduction = process.env.NODE_ENV === 'production';
const APP_NAME = require('../webpack/constants').APP_NAME;

const exclude_vendor = process.env.EXCLUDE_VENDOR;

function makeConfig() {
	return {
		context: path.join(__dirname, '..', 'src'),
		mode: webpackCommonConfig.getNodeEnv(),
		target: 'web',
		recordsPath: path.join(__dirname, '..', 'records.json'),
		parallelism: 1,
		profile: true,
		entry: {
			vendor: paths.appVendor(__dirname),
			...(fs.existsSync(paths.langEn(__dirname)) && {
				en: paths.langEn(__dirname),
				hi: paths.langHi(__dirname),
			}),
			app: paths.appIndexJs(__dirname),
		},
		output: {
			path: isProduction ? path.join(paths.appBuild, APP_NAME) : paths.appBuildDev,
			filename: isProduction ? '[name].[chunkhash].js' : '[name].bundle.js',
			publicPath: isProduction ? '//img1a.flixcart.com/www/linchpin/' + APP_NAME + '/' : '/public/',
			pathinfo: !isProduction,
			chunkFilename: isProduction ? '[name].[chunkhash].js' : '[name].bundle.js',
			jsonpFunction: 'webpackJsonp',
		},
		devServer: {
			hot: true,
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
			modules: [
				'common',
				'node_modules',
				'components',
				'actions',
				'states',
				'stores',
				'helpers',
				'utils',
				'images',
				'mocks',
			],
			alias: {
				'fk-cp-utils': path.resolve(__dirname, '..', 'node_modules/@fpg-modules/fk-cp-utils'),
				'fk-ui-common': path.resolve(__dirname, '..', 'node_modules/@fpg-modules/fk-ui-common/src'),
				'fk-ui-common-components': path.resolve(
					__dirname,
					'..',
					'node_modules/@fpg-modules/fk-ui-common/src/components'
				),
			},
		},
		performance: {
			maxEntrypointSize: 100000,
			maxAssetSize: 100000,
		},
		optimization: {
			minimizer: [webpackCommonConfig.getUglifyJs(), new OptimizeCssAssetsPlugin()],
			namedModules: true,
			splitChunks: {
				name: true,
				cacheGroups: {
					default: false,
					vendors: false,
					vendor: {
						chunks: 'all',
						name: 'vendor',
						test: 'vendor',
						enforce: true,
						priority: 2,
					},
					common: {
						chunks: 'all',
						name: 'common',
						minChunks: 2,
						priority: 1,
					},
				},
			},
		},
		stats: {
			colors: true,
			version: true,
		},
		module: {
			rules: LOADERS,
		},
		plugins: PLUGINS,
		devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
	};
}

// PROD && (CONFIG.devtool = 'hidden-source-map');

module.exports = makeConfig();