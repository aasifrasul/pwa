const userOne = {
	firstName: 'Aasif',
	lastName: 'Rasul',
};

const userbackUp = {};

Object.defineProperty(userOne, 'lastName', {
	configurable: true,
	enumerable: true,
	get() {
		return document.querySelector('#lastName').value;
	},
	set(value) {
		document.querySelector('#lastName').value = value;
	},
});

Object.defineProperty(userOne, 'firstName', {
	configurable: true,
	enumerable: true,
	get() {
		return document.querySelector('#firstName').value;
	},
	set(value) {
		document.querySelector('#firstName').value = value;
	},
});

userOne.firstName = 'Aasif1';
userOne.lastName = 'Rasul1';

document.addEventListener('keyup', (e) => {
	userOne[e.target.id] = e.target.value;
	console.log(userOne);
});

// userOne.firstName = 'Aasif'

var person = (function (el) {
	return {
		set age(v) {
			el.value = v;
		},
		get age() {
			return el.value;
		},
	};
})(document.getElementById('age'));
