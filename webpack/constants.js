module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? 'https://img1a.flixcart.com/www/linchpin/ally-test/' : '/',
	APP_NAME: require('../package.json').name,
	SENTRY_VERSION: '2.1.2',
	SENTRY_KEY: 'https://e360ff5c7562465c8740a196305afd84@sentry.flipkart.com/63',
	SENTRY_URL: 'https://img1a.flixcart.com/www/linchpin/sentry/5.3.0/bundle.min.js',
	DEV: process.env.NODE_ENV !== 'production',
};
