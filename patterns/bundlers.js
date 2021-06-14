// common code for implementing require()/exports
var dependencies = {}; // loaded modules
var modules = {}; // code of your dependencies
// require function
var require = function (module) {
	if (!dependencies[module]) {
		// module not loaded, let’s load it
		var exports = {};
		modules[module](exports);
		// now in `exports` we have the things made “public”
		dependencies[module] = exports;
	}
	return dependencies[module];
};
// dependendencies
modules['jquery'] = function (exports) {
	// code of jquery
};
modules['foo'] = function (exports) {
	// code of bar.js
	exports.helloWorld = function () {
		console.log('hello world');
	};
};
modules['bar'] = function (exports) {
	// code of bar.js
};
// etc…
// here goes the code of your "entry file".
// Which is the entry point of your code
// For example:
var $ = require('jquery');
var foo = require('foo');
var bar = require('bar');
foo.helloWorld();
