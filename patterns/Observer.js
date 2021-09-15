var Subject = function () {
	this.observers = [];

	return {
		observers: this.observers,
		subscribeObserver: function (observer) {
			this.observers.push(observer);
		},
		unsubscribeObserver: function (observer) {
			var index = this.observers.indexOf(observer);
			if (index > -1) {
				this.observers.splice(index, 1);
			}
		},
		notifyObserver: function (observer) {
			var index = this.observers.indexOf(observer);
			if (index > -1) {
				this.observers[index].notify(index);
			}
		},
		notifyAllObservers: function () {
			for (var i = 0; i < this.observers.length; i++) {
				this.observers[i].notify(i);
			}
		},
	};
};

var Observer = function () {
	return {
		notify: function (index) {
			console.log('Observer ' + index + ' is notified!');
		},
	};
};

var subject = new Subject();

var observer1 = new Observer();
var observer2 = new Observer();
var observer3 = new Observer();
var observer4 = new Observer();

subject.subscribeObserver(observer1);
subject.subscribeObserver(observer2);
subject.subscribeObserver(observer3);
subject.subscribeObserver(observer4);

subject.notifyObserver(observer2); // Observer 2 is notified!

subject.notifyAllObservers();
// Observer 1 is notified!
// Observer 2 is notified!
// Observer 3 is notified!
// Observer 4 is notified!

class Subject {
	constructor() {
		this.observers = [];
	}

	subscribe(observer) {
		this.observers.push(observer);
	}

	unSubscribe(observer) {
		const index = this.observers.indexOf(observer);
		if (index > -1) {
			this.observers.splice(index, 1);
		}
	}

	notifyObserver(observer, data) {
		const index = this.observers.indexOf(observer);
		if (index > -1) {
			this.observers[index].notify(data);
		}
	}

	notifyAllObservers(data) {
		this.observers.forEach((i) => i.notify(data));
	}
}

class Observer {
	constructor(name) {
		this.name = name;
		//this.notify = this.notify.bind(this);
	}

	notify(data) {
		console.log(`Notfied ${this.name} with data`, data);
	}
}

const subject = new Subject();

const observer1 = new Observer('Observer1');
const observer2 = new Observer('Observer2');
const observer3 = new Observer('Observer3');
const observer4 = new Observer('Observer4');
const observer5 = new Observer('Observer5');

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.subscribe(observer3);
subject.subscribe(observer4);
subject.subscribe(observer5);

subject.notifyObserver(observer3, 'Hello');

subject.notifyAllObservers('Hello to All');
