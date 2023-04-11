const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

class BaseQueue {
	constructor() {
		this.storage = {};
		this.count = 0;
		this.lowestCount = 0;
	}
	enqueue(item) {
		if (item) {
			this.storage[this.count] = item;
			this.count++;
		}
	}
	dequeue() {
		if (this.count - this.lowestCount === 0) {
			return undefined;
		}

		const result = this.storage[this.lowestCount];
		delete this.storage[this.lowestCount];
		this.lowestCount++;
		return result;
	}
	get size() {
		return this.items.length;
	}
}

class AsyncQueue extends BaseQueue {
	constructor() {
		super();
		this.isPending = false;
	}
	enqueue(promise) {
		return new Promise((resolve, reject) => {
			super.enqueue({ promise, resolve, reject });
			this.dequeue();
		});
	}
	dequeue() {
		if (this.isPending) {
			console.log('Queue is busy');
			return false;
		}

		const item = super.dequeue();

		if (!item) {
			console.log('No items in queue');
			return false;
		}

		this.isPending = true;
		const { promise, resolve, reject } = item;
		const newPromise = dataType(promise) === 'promise' ? promise : promise();

		newPromise
			.then(
				(data) => {
					this.isPending = false;
					console.log('data', data);
					resolve(data);
				},
				(e) => {
					reject(e);
				},
			)
			.catch((e) => {
				reject(e);
			})
			.finally(() => {
				this.dequeue();
			});

		return true;
	}
}

const asyncQueue = new AsyncQueue();

// generates a promise
const asyncGenerator = ({ ms, ...rest } = {}) => new Promise((resolve) => setTimeout(resolve, ms, rest));

// creates a N items promise array
const promises = Array.apply(null, { length: 50 }).map(Function.call, (i) =>
	asyncGenerator.bind(null, { ms: Math.random() * 200, url: `(${i})`, data: `payload(${i})` }),
);

// start proformance timing
const start = performance.now();

function myPromiseAll(promises) {
	if (dataType(promises) !== 'array') {
		throw new Error('Parameter expected of type array');
	}

	const resolvedPromises = [];

	// start proformance timing
	const start = performance.now();

	return new Promise((resolve, reject) => {
		promises.forEach((promise) =>
			asyncQueue.enqueue(promise).then(
				(data) => {
					resolvedPromises.push(data);
					console.log(`DONE => time`, performance.now() - start);
					if (promises.length === resolvedPromises.length) {
						console.log('All Done');
						resolve(resolvedPromises);
					}
				},
				(e) => {
					reject(e);
				},
			),
		);
	});
}

myPromiseAll(promises).then((data) => console.log(data));

myPromiseAll([
	fetch('https://api.github.com/users/aasifrasul/followers'),
	fetch('https://api.github.com/users/aasifrasul/repos'),
]).then((data) => console.log(data));
