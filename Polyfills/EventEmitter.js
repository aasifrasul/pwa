class EventEmitter {
	constructor() {
		this._observers = new Set();
	}

	subscribe(observer) {
		this._observers.add(observer);
	}

	unsubscribe(observer) {
		this._observers.delete(observer);
	}

	emit(event, data) {
		this._observers.forEach((observer) => {
			observer.update(event, data);
		});
	}
}

class Observer {
	update(event, data) {
		console.log(`Received event ${event} with data ${data}`);
	}
}

const emitter = new EventEmitter();
const observer1 = new Observer();
const observer2 = new Observer();

emitter.subscribe(observer1);
emitter.subscribe(observer2);

emitter.emit('event1', 'data1'); // Output: Received event event1 with data data1
emitter.emit('event2', 'data2'); // Output: Received event event2 with data data2

emitter.unsubscribe(observer2);

emitter.emit('event3', 'data3'); // Output: Received event event3 with data data3 (only observer1 receives the notification)
