const Queue = (function () {
	const Queue = function () {
		if (Queue.instance) {
			// Singleton
			console.log('Return the existing instance');
			return Queue.instance;
		}
		this.reset();
		Queue.instance = this;
	};

	Queue.prototype.reset = function () {
		console.log('Queue is reset');
		this.hash = {};
		this.count = 0;
		this.lowestCount = 0;
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

		this.hash[key] = data;
	};

	Queue.prototype.dequeue = function () {
		if (this.size() === 0) {
			this.reset();
			return;
		}

		const result = this.hash[this.lowestCount];
		delete this.hash[this.lowestCount];
		this.increment('lowestCount');
		return result;
	};

	Queue.prototype.size = function () {
		return this.count - this.lowestCount;
	};

	return Queue;
})();

const queue = new Queue();

self.addEventListener(
	'message',
	(e) => {
		console.log('Data received from main Thread', e.data);
	},
	false
);

self.postMessage('From WebWorker');
