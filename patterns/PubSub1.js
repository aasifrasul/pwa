/**
 * Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk
 * License: MIT - http://mrgnrdrck.mit-license.org
 *
 * https://github.com/mroderick/PubSubJS
 */

const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isObject = (data) => dataType(data) === 'object';
const isFunction = (data) => dataType(data) === 'function';
const isSymbol = (data) => dataType(data) === 'symbol';
const isString = (data) => dataType(data) === 'string';

function getGlobalContext() {
	if (typeof global !== 'object' || !global || global.Math !== Math || global.Array !== Array) {
		return getGlobal();
	}
	return global;
}

function getGlobal() {
	if (typeof self !== 'undefined') {
		return self;
	} else if (typeof window !== 'undefined') {
		return window;
	} else if (typeof global !== 'undefined') {
		return global;
	} else {
		return new Function('return this')();
	}
}

const globalContext = getGlobalContext();

(function (root, factory) {
	'use strict';

	const PubSub = Object.create(null);
	root.PubSub = PubSub;
	factory(PubSub);
	// CommonJS and Node.js module support
	if (typeof exports === 'object') {
		if (module !== undefined && module.exports) {
			exports = module.exports = PubSub; // Node.js specific `module.exports`
		}
		exports.PubSub = PubSub; // CommonJS module 1.1.1 spec
		module.exports = exports = PubSub; // CommonJS
	}
	// AMD support
	/* eslint-disable no-undef */
	else if (typeof define === 'function' && define.amd) {
		define(function () {
			return PubSub;
		});
		/* eslint-enable no-undef */
	}
})(globalContext, function (PubSub) {
	//}.call(globalContext, function (PubSub) {
	//})(isObject(window) ? window : this, function (PubSub) {
	'use strict';

	const messages = Object.create(null),
		ALL_SUBSCRIBING_MSG = '*';
	let lastUid = -1;

	function hasKeys(obj) {
		let key;

		for (key in obj) {
			if (hasOwnProperty(obj, key)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns a function that throws the passed exception, for use as argument for setTimeout
	 * @alias throwException
	 * @function
	 * @param { Object } ex An Error object
	 */
	function throwException(ex) {
		return function reThrowException() {
			throw ex;
		};
	}

	function callSubscriberWithDelayedExceptions(subscriber, message, data) {
		try {
			subscriber(message, data);
		} catch (ex) {
			setTimeout(throwException(ex), 0);
		}
	}

	function callSubscriberWithImmediateExceptions(subscriber, message, data) {
		subscriber(message, data);
	}

	function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
		const subscribers = messages[matchedMessage],
			callSubscriber = immediateExceptions
				? callSubscriberWithImmediateExceptions
				: callSubscriberWithDelayedExceptions;
		let s;

		if (!hasOwnProperty(messages, matchedMessage)) {
			return;
		}

		for (s in subscribers) {
			if (hasOwnProperty(subscribers, s)) {
				callSubscriber(subscribers[s], originalMessage, data);
			}
		}
	}

	function createDeliveryFunction(message, data, immediateExceptions) {
		return function deliverNamespaced() {
			let topic = String(message),
				position = topic.lastIndexOf('.');

			// deliver the message as it is now
			deliverMessage(message, message, data, immediateExceptions);

			// trim the hierarchy and deliver message to each level
			while (position !== -1) {
				topic = topic.substr(0, position);
				position = topic.lastIndexOf('.');
				deliverMessage(message, topic, data, immediateExceptions);
			}

			deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);
		};
	}

	function hasDirectSubscribersFor(message) {
		const topic = String(message),
			found = Boolean(hasOwnProperty(messages, topic) && hasKeys(messages[topic]));

		return found;
	}

	function messageHasSubscribers(message) {
		let topic = String(message),
			found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG),
			position = topic.lastIndexOf('.');

		while (!found && position !== -1) {
			topic = topic.substr(0, position);
			position = topic.lastIndexOf('.');
			found = hasDirectSubscribersFor(topic);
		}

		return found;
	}

	function publish(message, data, sync, immediateExceptions) {
		message = isSymbol(message) ? message.toString() : message;

		if (!messageHasSubscribers(message)) {
			return false;
		}

		const deliver = createDeliveryFunction(message, data, immediateExceptions);

		if (sync === true) {
			deliver();
		} else {
			setTimeout(deliver, 0);
		}
		return true;
	}

	/**
	 * Publishes the message, passing the data to it's subscribers
	 * @function
	 * @alias publish
	 * @param { String } message The message to publish
	 * @param {} data The data to pass to subscribers
	 * @return { Boolean }
	 */
	PubSub.publish = function (message, data) {
		return publish(message, data, false, PubSub.immediateExceptions);
	};

	/**
	 * Publishes the message synchronously, passing the data to it's subscribers
	 * @function
	 * @alias publishSync
	 * @param { String } message The message to publish
	 * @param {} data The data to pass to subscribers
	 * @return { Boolean }
	 */
	PubSub.publishSync = function (message, data) {
		return publish(message, data, true, PubSub.immediateExceptions);
	};

	/**
	 * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
	 * @function
	 * @alias subscribe
	 * @param { String } message The message to subscribe to
	 * @param { Function } func The function to call when a new message is published
	 * @return { String }
	 */
	PubSub.subscribe = function (message, func) {
		if (!isFunction(func)) {
			return false;
		}

		message = isSymbol(message) ? message.toString() : message;

		// message is not registered yet
		if (!hasOwnProperty(messages, message)) {
			messages[message] = Object.create(null);
		}

		// forcing token as String, to allow for future expansions without breaking usage
		// and allow for easy use as key names for the 'messages' object
		const token = 'uid_' + String(++lastUid);
		messages[message][token] = func;

		// return token for unsubscribing
		return token;
	};

	PubSub.subscribeAll = (func) => PubSub.subscribe(ALL_SUBSCRIBING_MSG, func);

	/**
	 * Subscribes the passed function to the passed message once
	 * @function
	 * @alias subscribeOnce
	 * @param { String } message The message to subscribe to
	 * @param { Function } func The function to call when a new message is published
	 * @return { PubSub }
	 */
	PubSub.subscribeOnce = function (message, func) {
		const token = PubSub.subscribe(message, function () {
			// before func apply, unsubscribe message
			PubSub.unsubscribe(token);
			func.apply(this, arguments);
		});
		return PubSub;
	};

	/**
	 * Clears all subscriptions
	 * @function
	 * @public
	 * @alias clearAllSubscriptions
	 */
	PubSub.clearAllSubscriptions = function clearAllSubscriptions() {
		messages = Object.create(null);
	};

	/**
	 * Clear subscriptions by the topic
	 * @function
	 * @public
	 * @alias clearAllSubscriptions
	 * @return { int }
	 */
	PubSub.clearSubscriptions = function clearSubscriptions(topic) {
		let m;
		for (m in messages) {
			if (hasOwnProperty(messages, m) && m.indexOf(topic) === 0) {
				delete messages[m];
			}
		}
	};

	/**
       Count subscriptions by the topic
     * @function
     * @public
     * @alias countSubscriptions
     * @return { Array }
    */
	PubSub.countSubscriptions = function countSubscriptions(topic) {
		let m,
			count = 0;
		for (m in messages) {
			if (hasOwnProperty(messages, m) && m.indexOf(topic) === 0) {
				count++;
			}
		}
		return count;
	};

	/**
       Gets subscriptions by the topic
     * @function
     * @public
     * @alias getSubscriptions
    */
	PubSub.getSubscriptions = function getSubscriptions(topic) {
		let m;
		const list = [];
		for (m in messages) {
			if (hasOwnProperty(messages, m) && m.indexOf(topic) === 0) {
				list.push(m);
			}
		}
		return list;
	};

	/**
	 * Removes subscriptions
	 *
	 * - When passed a token, removes a specific subscription.
	 *
	 * - When passed a function, removes all subscriptions for that function
	 *
	 * - When passed a topic, removes all subscriptions for that topic (hierarchy)
	 * @function
	 * @public
	 * @alias subscribeOnce
	 * @param { String | Function } value A token, function or topic to unsubscribe from
	 * @example // Unsubscribing with a token
	 * var token = PubSub.subscribe('mytopic', myFunc);
	 * PubSub.unsubscribe(token);
	 * @example // Unsubscribing with a function
	 * PubSub.unsubscribe(myFunc);
	 * @example // Unsubscribing from a topic
	 * PubSub.unsubscribe('mytopic');
	 */
	PubSub.unsubscribe = function (value) {
		var isTopic = isString(value) && (hasOwnProperty(messages, value) || descendantTopicExists(value)),
			isToken = !isTopic && isString(value),
			result = false,
			m,
			message,
			t;

		function descendantTopicExists(topic) {
			var m;
			for (m in messages) {
				if (hasOwnProperty(messages, m) && m.indexOf(topic) === 0) {
					// a descendant of the topic exists:
					return true;
				}
			}

			return false;
		}

		if (isTopic) {
			PubSub.clearSubscriptions(value);
			return;
		}

		for (m in messages) {
			if (hasOwnProperty(messages, m)) {
				message = messages[m];

				if (isToken && message[value]) {
					delete message[value];
					result = value;
					// tokens are unique, so we can just stop here
					break;
				}

				if (isFunction(value)) {
					for (t in message) {
						if (hasOwnProperty(message, t) && message[t] === value) {
							delete message[t];
							result = true;
						}
					}
				}
			}
		}

		return result;
	};
});

const token = PubSub.subscribe('radio1', (data) => console.log(data));
console.log('token', token);

PubSub.publish('radio1', {
	url: '/some/url/path', // any argument
});

PubSub.unsubscribe(token);
