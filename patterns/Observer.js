class Subject {
	constructor() {
		this.observers = [];
	}

	addObserver(observer) {
		this.observers.push(observer);
	}

	removeObserver(observer) {
		this.observers = this.observers.filter((obs) => obs !== observer);
	}

	notifyObservers(data) {
		this.observers.forEach((observer) => observer.update(data));
	}
}

class Observer {
	update(data) {
		console.log(`Received update: ${data}`);
		// Perform necessary actions based on the update data
	}
}

// Usage example:
const subject = new Subject();
const observer1 = new Observer();
const observer2 = new Observer();

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notifyObservers('Hello, observers!'); // Output will be:
// Received update: Hello, observers!
// Received update: Hello, observers!

subject.removeObserver(observer1);

subject.notifyObservers('Observers reduced!'); // Output will be:
// Received update: Observers reduced!
