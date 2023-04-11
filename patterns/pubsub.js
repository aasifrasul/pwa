const dataType = (variable) => Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
const isFunction = (func) => dataType(func) === 'function';
const isArray = (arr) => dataType(arr) === 'array';
const isString = (str) => dataType(str) === 'string';

const PubSub = (function () {
	const subscribers = {};

	const subscribe = (eventName, callback) => {
		if (!isFunction(callback) || !isString(eventName)) {
			return;
		}

		if (!isArray(subscribers[eventName])) {
			subscribers[eventName] = [];
		}

		const index = subscribers[eventName].push(callback) - 1;

		return {
			unsubscribe() {
				subscribers[eventName].splice(index, 1);
			},
			/*
			unsubscribe() {
				subscribers[eventName] = subscribers[eventName].filter((cb) => {
					// Does not include the callback in the new array
					return cb === callback ? false : true;
				});
			},
			*/
		};
	};

	const publish = (eventName, data) => subscribers[eventName]?.forEach((cb) => cb(data));

	return {
		subscribe,
		publish,
	};
})();

const subscription = PubSub.subscribe('/page/load', function (obj) {
	console.log('subscribed to', obj);
	// Do something now that the event has occurred
});

const subscription2 = PubSub.subscribe('/page/load', function (obj) {
	console.log('subscribed2 to', obj);
	// Do something now that the event has occurred
});

const subscription3 = PubSub.subscribe('/page/load', function (obj) {
	console.log('subscribed3 to', obj);
	// Do something now that the event has occurred
});

PubSub.publish('/page/load', {
	url: '/some/url/path', // any argument
});

// ...sometime later where I no longer want subscription...
subscription.unsubscribe();
subscription2.unsubscribe();
subscription3.unsubscribe();
