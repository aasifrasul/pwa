/**
 * Declares an empty promise
 *
 * @class Deferred
 */
class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
		this.data = null;
		this.resolve = this.resolve.bind(this);
		this.reject = this.reject.bind(this);
		this.forceUpdateResolvedData = this.forceUpdateResolvedData.bind(this);
	}

	forceUpdateResolvedData(value) {
		this.data = value;
	}
}

/**
 * PromiseFactory is a factory which maintains unique this.promises generated
 * by the app. This allows this.promises generated within the app to be reused
 * across various pages in the app.
 * NOTE:: Use this factory to add a promise only if the this.promises are unique
 * or can be uniquely identified via an identifier.
 *
 * @class PromiseFactory
 */

class PromiseFactory {
	construtor() {
		this.promise = null;
		this.promises = new Map();
	}

	validateId(key) {
		if (!key) {
			throw new Error('key cannot be empty !');
		}
		return this.promises.get(key);
	}

	add(key) {
		key && this.promises.set(key, new Deferred());
		return this.get(key);
	}

	get(key) {
		this.promise = this.promises.get(key);
		return this.promise;
	}

	fetchResolvedData(key) {
		return this.get(key)?.data;
	}

	updateResolvedData(key, data) {
		this.get(key);
		this.promise?.forceUpdateResolvedData(data);
	}

	resolve(key, data) {
		this.get(key);
		this.promise?.resolve(data);
	}

	reject(key, msg) {
		this.get(key);
		this.promise?.reject(msg);
	}

	remove(key) {
		return this.promises.delete(key);
	}

	getOrAdd(key) {
		return this.get(key) || this.add(key);
	}
}
