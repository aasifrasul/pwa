// webpack
const socketio = require('socket.io');
const webpack = require('webpack');
const os = require('os');
const fs = require('fs');

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

const enc = {
	encoding: 'utf-8',
};

const generateBuildTime = async function () {
	return new Promise((resolve, reject) => {
		fs.writeFile(path.join(__dirname, '..', 'public', 'server', 'buildtime'), new Date().toUTCString(), function (
			err
		) {
			if (err) {
				reject('Error occured while writing to generateBuildTime :: ' + err.toString());
			}
			resolve();
		});
	});
};

generateBuildTime();

const getStartTime = () => {
	if (process.env.NODE_ENV !== 'production') {
		return fs.readFileSync(path.join(__dirname, '..', 'public', 'server', 'buildtime'), enc);
	}

	let startTime = fs.readFileSync(path.join(__dirname, 'public', 'server', 'buildtime'), enc);
	startTime = new Date(Date.parse(startTime) + 1000000000).toUTCString();
	return startTime;
};

const startTime = getStartTime();

// Last modified header
// Assumtion here is that the everytime any file is modified, the build is restarted hence last-modified == build time.
const nocache = function (res) {
	res.set({
		'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
		Expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
		Pragma: 'no-cache',
		'Last-Modified': startTime,
	});
};

const webWorkerContent = fs.readFileSync(`./src/utils/WebWorker.js`, enc);

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

app.get('/WebWorker.js', function (req, res) {
	res.set('Content-Type', `application/javascript; charset=${enc.encoding}`);
	nocache(res);
	res.end(webWorkerContent);
});

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
	const currencyPairs = [
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

	let IntervalId;

	socket.on('fetchOSStats', () => {
		const data = os.cpus();
		socket.emit('oSStatsData', data);
	});

	//handle the new message event
	socket.on('fetchCurrencyPair', () => {
		IntervalId && clearInterval(IntervalId);
		IntervalId = setInterval(() => {
			const data = getRandomizedArray(currencyPairs)[0];
			socket.emit('currencyPairData', data);
		}, 1);
	});
});
