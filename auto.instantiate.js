function Foo() {
	if (!(this instanceof Foo)) {
		return new Foo();
	}
}

function Fubar(foo, bar) {
	'use strict';

	var obj, ret;

	if (this instanceof Fubar) {
		this._foo = foo;
		this._bar = bar;
	} else {
		return new Fubar(foo, bar);
	}
}

Fubar('Situation Normal', 'All Fsked Up');

function logsArguments(fn) {
	return function () {
		console.log.apply(this, arguments);
		return fn.apply(this, arguments);
	};
}

function sum2(a, b) {
	return a + b;
}

var logsSum = logsArguments(sum2);

logsSum(2, 2);

function Fubar(foo, bar) {
	'use strict';

	var obj, ret;

	if (this instanceof Fubar) {
		this._foo = foo;
		this._bar = bar;
	} else {
		obj = new Fubar();
		ret = Fubar.apply(obj, arguments);
		return ret === undefined ? obj : ret;
	}
}

Fubar.prototype.concatenated = function () {
	return this._foo + ' ' + this._bar;
};

var LoggingFubar = logsArguments(Fubar);

var snafu = new LoggingFubar('Situation Normal', 'All Fsked Up');
//=> Situation Normal All Fsked Up

snafu.concatenated();
//=> 'Situation Normal All Fsked Up'
