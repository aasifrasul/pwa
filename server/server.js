// webpack
const socketio = require('socket.io');
const webpack = require('webpack');
const os = require('os');

const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack-configs/webpack.config');
const cors = require('cors');
const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const proxy = require('express-http-proxy');
const path = require('path');
const AppHelper = require('./helper');
const { userAgentHandler } = require('./middlewares');
const app = express();
// port to use
const port = 3100;
//Set hbs template config
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('views', path.join(__dirname, '..', 'public', 'ally-test'));
app.set('view engine', '.hbs');

handlebars.registerHelper({
	if_eq: (a, b, opts) => {
		if (a === b) {
			return opts.fn(Object.create(null));
		}
	},
});

app.use(cors());
app.use(cookieParser());
app.use(userAgentHandler);

// start the webpack dev server
const devServer = new WebpackDevServer(webpack(webpackConfig), {
	publicPath: webpackConfig.output.publicPath,
});
devServer.listen(port + 1, 'localhost', function () {
	console.log('webpack-dev-server listening on port 3001');
});

const bundleConfig = [
	webpackConfig.output.publicPath + 'en.bundle.js',
	webpackConfig.output.publicPath + 'vendor.bundle.js',
	webpackConfig.output.publicPath + 'app.bundle.js',
];

// start the express server
app.use(
	'/public',
	proxy('localhost:' + (port + 1), {
		forwardPath: function forwardPath(req) {
			return req.originalUrl;
		},
	})
);

app.all('/*', (req, res) => {
	const data = {
		js: bundleConfig,
		...AppHelper.constructReqDataObject(req),
		dev: true,
	};
	data.layout = false;
	res.render('next1-ally-test', data);
});

//Start the server
const server = app.listen(port, function () {
	console.log('Express server listening on port %s', port);
});

const io = socketio(server);

io.on('connection', (socket) => {
	currencyPairs = [
		{
			key: 'EURUSD',
			value: 1.1857,
		},
		{
			key: 'USDEUR',
			value: 0.8965,
		},
		{
			key: 'INRUSD',
			value: 75.876,
		},
		{
			key: 'USDINR',
			value: 0.0567,
		},
		{
			key: 'YENUSD',
			value: 118.9857,
		},
		{
			key: 'USDYEN',
			value: 0.0567,
		},
		{
			key: 'EURINR',
			value: 3.567,
		},
		{
			key: 'INREUR',
			value: 78.987,
		},
		{
			key: 'EURYEN',
			value: 3.567,
		},
		{
			key: 'YENEUR',
			value: 0.00987,
		},
	];

	const getRandomizedArray = (arr) => arr.sort(() => 0.5 - Math.random());
	console.log('New user connected');

	let IntervalId;

	socket.on('fetchOSStats', () => {
		const data = os.cpus();
		console.log(data);
		console.log('fetchOSStats invoked');
		socket.emit('oSStatsData', data);
	});

	//handle the new message event
	socket.on('fetchCurrencyPair', () => {
		console.log('fetchCurrencyPair invoked');
		IntervalId && clearInterval(IntervalId);
		IntervalId = setInterval(() => {
			socket.emit(
				'currencyPairData',
				new Array(100)
					.fill(0)
					.map((i) => getRandomizedArray(currencyPairs))
					.flat()
			);
		}, 1000);
	});
});
