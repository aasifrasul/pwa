const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
const isArray = (arr) => dataType(arr) === 'array';
const isFunction = (func) => dataType(func) === 'function';

const safeExecFunc = (...params) => {
	const func = params.shift();
	console.log(`func => ${func}`);
	console.log(`params => ${params}`);
	isFunction(func) && func.apply(func, params);
};

class myPromise {
	constructor(callback) {
		if (!isFunction(callback)) {
			throw new Error('constructor parameter needs to be a function callback');
		}
		this.state = {
			data: null,
			error: null,
			status: 'pending', // pending/fulfilled/rejected
		};
		this.resolve = this.resolve.bind(this);
		this.reject = this.reject.bind(this);
		queueMicrotask(() => safeExecFunc(callback, this.resolve, this.reject));
	}

	resolve(data) {
		this.state.status = 'fulfilled';
		this.state.data = data;
		safeExecFunc(this.onFulfilled, data);
	}

	reject(err) {
		this.state.status = 'rejected';
		this.state.error = err;
		safeExecFunc(this.onRejected, new Error(err));
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
		['fulfilled', 'rejected'].includes(this.state.status) && safeExecFunc(callback);
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
	})
	.finally(() => {
		console.log('In Finally');
	});
