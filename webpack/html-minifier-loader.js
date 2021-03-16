var minify = require('html-minifier').minify;
var loaderUtils = require('loader-utils');
const options = loaderUtils.getOptions(this);

module.exports = function (source) {
	this.cacheable && this.cacheable();
	var callback = this.async(),
		defaultOptions = {
			removeComments: true,
			collapseWhitespace: true,
		};

	if (options) {
		for (var k in defaultOptions) {
			if (options[k] == null) {
				options[k] = defaultOptions[k];
			}
		}
	}

	callback(null, minify(source, options || defaultOptions));
};
