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
 * PromiseFactory is a factory which maintains unique promises generated
 * by the app. This allows promises generated within the app to be reused
 * across various pages in the app.
 * NOTE:: Use this factory to add a promise only if the promises are unique
 * or can be uniquely identified via an identifier.
 *
 * @class PromiseFactory
 */

const promises = new Map();

class PromiseFactory {
	validateId(key) {
		if (!key) {
			throw new Error('key cannot be empty !');
		}
		return promises.get(key);
	}

	add(key) {
		key && promises.set(key, new Deferred());
		return this.get(key);
	}

	get(key) {
		return promises.get(key);
	}

	fetchResolvedData(key) {
		const { data } = this.get(key) || {};
		return data;
	}

	updateResolvedData(key, data) {
		const promise = this.get(key);
		promise?.forceUpdateResolvedData(data);
	}

	resolve(key, data) {
		const promise = this.get(key);
		return promise?.resolve(data);
	}

	reject(key, msg) {
		const promise = this.get(key);
		return promise?.reject(msg);
	}

	remove(key) {
		return promises.delete(key);
	}

	getOrAdd(key) {
		return this.get(key) || this.add(key);
	}
}
