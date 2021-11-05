const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isArray = (arr) => dataType(arr) === 'array';
const isFunction = (func) => dataType(func) === 'function';

const safeExecFunc = (...params) => {
	const func = params.shift();
	isFunction(func) && func.apply(func, params);
};

class myPromise {
	constructor(callback) {
		if (!isFunction(callback)) {
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
		queueMicrotask(() => callback(this.resolve, this.reject));
	}

	resolve(data) {
		console.log('Inside resolve', data);
		this.state.status = 'fulfilled';
		this.state.data = data;
		isFunction(this.onFulfilled) && this.onFulfilled(data);
	}

	reject(err) {
		console.log('Inside reject', err);
		this.state.status = 'rejected';
		this.state.error = err;
		isFunction(this.onRejected) && this.onRejected(new Error(err));
	}

	then(onFulfilled, onRejected) {
		if (!isFunction(onFulfilled)) {
			throw new Error('First Param is required and should be a function');
		}

		if (onRejected && !isFunction(onRejected)) {
			throw new Error('If Second Param is supplied it needs to be a function');
		}
		this.onFulfilled = onFulfilled;
		this.onRejected = onRejected;
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
	resolve('Hellooo');
	setTimeout(() => resolve('Hellooo'), 0);
});

promise
	.then(function (data) {
		console.log('Inside then', data);
	})
	.catch((err) => {
		console.log('Inside Catch');
	});
