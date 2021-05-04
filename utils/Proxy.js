function makeSimpleProfiler(target) {
	var forwarder = new ForwardingHandler(target);
	var count = Object.create(null);
	forwarder.get = function (rcvr, name) {
		count[name] = (count[name] || 0) + 1;
		return this.target[name];
	};
	return {
		proxy: new Proxy(forwarder, Object.getPrototypeOf(target)),
		get stats() {
			return count;
		},
	};
}

var subject = { foo: 42, bar: 24 };
var profiler = makeSimpleProfiler(subject);
// runApp(profiler.proxy);
// plotHistogram(profiler.stats);

function ForwardingHandler(obj) {
	this.target = obj;
}

ForwardingHandler.prototype = {
	has: function (name) {
		return name in this.target;
	},
	get: function (rcvr, name) {
		return this.target[name];
	},
	set: function (rcvr, name, val) {
		this.target[name] = val;
		return true;
	},
	delete: function (name) {
		return delete this.target[name];
	},
	enumerate: function () {
		var props = [];
		for (name in this.target) {
			props.push(name);
		}
		return props;
	},
	iterate: function () {
		var props = this.enumerate(),
			i = 0;
		return {
			next: function () {
				if (i === props.length) throw StopIteration;
				return props[i++];
			},
		};
	},
	keys: function () {
		return Object.keys(this.target);
	},
};

Proxy.wrap = function (obj) {
	return new Proxy(new ForwardingHandler(obj), Object.getPrototypeOf(obj));
};
