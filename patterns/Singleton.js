class Database {
	constructor() {
		if (Database.instance) {
			return Database.instance;
		}
		Database.instance = this;
	}

	connect() {
		// Connection logic
	}

	getInstance() {
		return Database.instance;
	}
}

const db1 = new Database();
const db2 = new Database();

console.log(db1 === db2); // true

var Singleton = (function () {
	function Singleton() {
		//Write your usual code here
	}
	var instance;
	return {
		getInstance: function () {
			if (null == instance) {
				instance = new Singleton();
				instance.constructor = null; // Note how the constructor is hidden to prevent instantiation
			}
			return instance; //return the singleton instance
		},
	};
})();

var Foo = function () {
	'use strict';
	if (Foo.instance) {
		// This allows the constructor to be called multiple times
		// and refer to the same instance. Another option is to
		// throw an error.
		return Foo.instance;
	}
	Foo.instance = this;
	// Foo initialization code
};

Foo.getInstance = function () {
	'use strict';
	return Foo.instance || new Foo();
};

var Foo = (function () {
	'use strict';
	var instance; //prevent modification of "instance" variable
	function Singleton() {
		if (instance) {
			return instance;
		}
		instance = this;
		//Singleton initialization code
	}
	// Instance accessor
	Singleton.getInstance = function () {
		return instance || new Singleton();
	};
	return Singleton;
})();
