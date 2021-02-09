var express = require('../fk-cp-batman-returns/node_modules/express');
var exphbs = require('../fk-cp-batman-returns/node_modules/express-handlebars');
var path = require('path');
// express server
// const appServer = require('app-richviews-server/server.development.js');
// port to use
const port = 3000;
var app = express();
//Set hbs template config
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('views', path.join(__dirname, '/'));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'js')));
console.log(path.join(__dirname, 'js'));

// // start the webpack dev server
// const devServer = new WebpackDevServer(webpack(webpackConfig), {
//  publicPath: webpackConfig.output.publicPath
// });
// devServer.listen( port + 1, 'localhost', function () {
//  console.log('webpack-dev-server listening on port 3001');
// });

// app.use('/public', proxy('localhost:' + (port + 1), {
//     forwardPath: function forwardPath(req) {we
//         console.log(req.originalUrl,"hell");
//         return req.originalUrl;
//     }
// }));
// const JS_FILES = [
//     //webpackConfig.output.publicPath + "vendor.231ae44964be0d5d2fb2.js",
//     webpackConfig.output.publicPath + "f0runtime.bundle.js",
//     webpackConfig.output.publicPath + "f1vendor.bundle.js",
//     webpackConfig.output.publicPath + "f2app.bundle.js",
//     "http://my.flipkart.com:3001/webpack-dev-server.js"
// ];

// start the express server
// appServer({
//  pattern: '/rv/*',

//  //js relative paths
//  js: JS_FILES,
//  css: [],
//  sentry: {},
//  flags: {},
//  shell: 'default',
//  addOmnitureScripts: true
// }, port);

app.get('/*', function (req, res) {
	res.render('home.hbs', {});
});
app.listen(port, function () {
	console.log('Express server listening on port %s', port);
});
