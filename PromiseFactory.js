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
	}

	forceResolve(value) {
		this.data = value;
		this.resolve(value)
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
class PromiseFactory {
	constructor() {
		this.promises = {};
	}

	validateId(key) {
		if (!key) {
			throw new Error('key cannot be empty !');
		}
		return this.promises[key];
	}

	add(key) {
		try {
			if (!this.validateId(key)) {
				this.promises[key] = new Deferred();
			}
			return true;
		} catch (e) {
			return e;
		}
	}

	remove(key) {
		try {
			if (this.validateId(key)) {
				delete this.promises[key];
			}
			return true;
		} catch (e) {
			return e;
		}
	}

	resolve(key, value) {
		try {
			if (this.validateId(key)) {
				const { promise, data } = this.promises[key] || {};
				if (data) {
					return promise;
				} else {
					this.promises[key].data = value;
					this.promises[key].promise = Promise.resolve(value);
					return this.promises[key].resolve(value);
				}
			}
		} catch (e) {
			return e;
		}
	}

	fetchPromise(key) {
		try {
			if (this.validateId(key)) {
				return this.promises[key];
			}
			return null;
		} catch (e) {
			return e;
		}
	}

	fetchResolvedData(key) {
		try {
			if (this.validateId(key)) {
				const promise = this.promises[key] || {};
				return promise.data;
			}
		} catch (e) {
			return e;
		}
	}
}
