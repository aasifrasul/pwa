class LRUCache {
	constructor(capacity) {
		this.capacity = capacity;
		this.cache = new Map();
		this.head = null;
		this.tail = null;
	}

	get(key) {
		if (this.cache.has(key)) {
			const entry = this.cache.get(key);
			this.moveToHead(entry);
			return entry.value;
		} else {
			return undefined;
		}
	}

	put(key, value) {
		if (this.cache.has(key)) {
			const entry = this.cache.get(key);
			entry.value = value;
			this.moveToHead(entry);
		} else {
			const entry = { key, value, prev: null, next: null };
			this.cache.set(key, entry);
			this.addToHead(entry);

			if (this.cache.size > this.capacity) {
				const tailKey = this.tail.key;
				this.removeTail();
				this.cache.delete(tailKey);
			}
		}
	}

	moveToHead(entry) {
		if (entry === this.head) {
			return;
		}

		if (entry.prev) {
			entry.prev.next = entry.next;
		}

		if (entry.next) {
			entry.next.prev = entry.prev;
		}

		if (entry === this.tail) {
			this.tail = entry.prev;
		}

		entry.next = this.head;
		this.head.prev = entry;
		entry.prev = null;
		this.head = entry;
	}

	addToHead(entry) {
		if (!this.head) {
			this.head = entry;
			this.tail = entry;
		} else {
			entry.next = this.head;
			this.head.prev = entry;
			this.head = entry;
		}
	}

	removeTail() {
		if (!this.tail) {
			return;
		}

		if (this.tail === this.head) {
			this.head = null;
			this.tail = null;
		} else {
			const prev = this.tail.prev;
			prev.next = null;
			this.tail = prev;
		}
	}
}
