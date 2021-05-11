import { isObject } from './typeChecking';

const Queue = (function () {
	const Queue = function () {
		if (Queue.instance) {
			// Singleton
			console.log('Return the existing instance');
			return Queue.instance;
		}
		this.hash = new Map();
		this.count = 0;
		this.lowestCount = 0;

		Queue.instance = this;
	};

	Queue.prototype.increment = function (key) {
		this[key] = this[key] + 1;
		return this[key];
	};

	Queue.prototype.decrement = function (key) {
		this[key] = this[key] - 1;
		return this[key];
	};

	Queue.prototype.enqueue = function (data, priority) {
		if (!data) {
			return;
		}
		let key;
		if (priority == 1) {
			key = this.decrement('lowestCount');
		} else {
			key = this.count;
			this.increment('count');
		}

		this.hash.set(key, data);
	};

	Queue.prototype.dequeue = function () {
		if (this.size() === 0) {
			this.count = this.lowestCount = 0;
			this.hash = new Map();
			return;
		}

		const result = this.hash.get(this.lowestCount);
		this.hash.delete(this.lowestCount);
		this.increment('lowestCount');
		return result;
	};

	Queue.prototype.bulkEnqueue = function (data) {
		data.forEach(this.enqueue);
	};

	Queue.prototype.size = function () {
		return this.count - this.lowestCount;
	};

	return Queue;
})();

const queue = new Queue();

export default queue;
