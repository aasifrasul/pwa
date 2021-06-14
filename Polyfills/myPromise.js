const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isArray = (arr) => dataType(arr) === 'array';
const isFunction = (func) => dataType(func) === 'function';

const safeExecFunc = (...params) => {
	const func = params.shift();
	isFunction(func) && func.apply(func, params);
};

class myPromise {
	constructor(callback) {
		if (typeof callback !== 'function') {
			throw new Error('constructor parameter needs to be a function callback');
		}
		console.log('Inside constructor');
		this.state = {
			data: null,
			error: null,
			status: 'pending',
		};
		this.resolve = this.resolve.bind(this);
		this.reject = this.reject.bind(this);
		callback(this.resolve, this.reject);
	}

	resolve(data) {
		console.log('Inside resolve', data);
		this.state.status = 'fulfilled';
		this.state.data = data;
	}

	reject(err) {
		this.state.status = 'rejected';
		this.state.error = err;
	}

	then(onFulfilled, onRejected) {
		if (!isFunction(onFulfilled)) {
			throw new Error('First Param is required and should be a function');
		}

		if (onRejected && !isFunction(onRejected)) {
			throw new Error('If Second Param is supplied it needs to be a function');
		}
		const { status, data, error } = this.state;
		status === 'fulfilled' && safeExecFunc(onFulfilled, data);
		status === 'rejected' && safeExecFunc(onRejected, data);
		return this;
	}

	catch(onRejected) {
		if (!isFunction(onRejected)) {
			throw new Error('Param supplied should be of type Function');
		}
		const { status, data } = this.state;
		status === 'rejected' && safeExecFunc(onRejected, data);
		return this;
	}

	finally(callback) {
		if (!isFunction(callback)) {
			throw new Error('Param supplied should be of of type fuction');
		}
		['fulfilled', 'rejected'].includes(this.state.status) && callback();
		return this;
	}
}

const promise = new myPromise(function (resolve, reject) {
	console.log('Inside myPromise Instance');
	reject(new Error('Failed'));
});

promise
	.then(function (data) {
		console.log('Inside then', data);
	})
	.catch((err) => {
		console.log('Inside Catch');
	});
