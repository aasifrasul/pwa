class BaseQueue {
	constructor() {
		this.storage = [];
	}
	enqueue(item) {
		this.storage.push(item);
	}
	dequeue() {
		return this.storage.shift();
	}
}

class AsyncQueue extends BaseQueue {
	constructor(maxExecutionLimit = 5) {
		super();
		this.processingCount = false;
		this.maxExecutionLimit = maxExecutionLimit;
	}
	enqueue(action) {
		return new Promise((resolve, reject) => {
			super.enqueue({ action, resolve, reject });
			this.dequeue();
		});
	}
	async dequeue() {
		if (this.processingCount >= this.maxExecutionLimit) {
			console.log('Queue is busy!');
			return;
		}

		const item = super.dequeue();

		if (!item) {
			console.log('Queue is empty');
			return;
		}

		try {
			this.processingCount++;
			const data = await item.action();
			console.log('data', data);
			this.processingCount--;
			item.resolve(data);
		} catch (e) {
			item.reject(e);
		} finally {
			this.dequeue();
		}
	}
}

const asyncQueue = new AsyncQueue();

const promises = Array(50)
	.fill(0)
	.map((item, idx) => () => {
		return new Promise((resolve, reject) => {
			const time = Math.random() * 200;
			setTimeout(
				() =>
					resolve({
						id: idx,
						time,
					}),
				time,
			);
		});
	});

promises.forEach((item) => asyncQueue.enqueue(item).then((data) => console.log(data)));
