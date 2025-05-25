function Child() {}
function Parent() {}
Parent.prototype.inheritedMethod = function () {
	return 'this is inherited';
};

function inherit(child, parent) {
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
	return child;
}

Child = inherit(Child, Parent);
const newChild = new Child();
console.log(newChild.inheritedMethod()); // this is inherited

function Child() {}
function Parent() {}
Parent.prototype.inheritedMethod = function () {
	return 'this is inherited';
};

function inherit(child, parent) {
	function tmp() {}
	tmp.prototype = parent.prototype;
	const proto = new tmp();
	proto.constructor = child;
	child.prototype = proto;
	return child;
}

Child = inherit(Child, Parent);
const o = new Child();
console.log(o.inheritedMethod()); // 'this is inherited'

//Define a functional object to hold persons in JavaScript
var Person = function (name) {
	this.name = name;
};

//Add dynamically to the already defined object a new getter
Person.prototype.getName = function () {
	return this.name;
};

//Create a new object of type Person
var john = new Person('John');

//Try the getter
alert(john.getName());

//If now I modify person, also John gets the updates
Person.prototype.sayMyName = function () {
	alert('Hello, my name is ' + this.getName());
};

//Call the new method on john
john.sayMyName();

//Create a new object of type Customer by defining its constructor. It's not
//related to Person for now.
var Customer = function (name) {
	this.name = name;
};

//Now I link the objects and to do so, we link the prototype of Customer to
//a new instance of Person. The prototype is the base that will be used to
//construct all new instances and also, will modify dynamically all already
//constructed objects because in JavaScript objects retain a pointer to the
//prototype
Customer.prototype = new Person();

//Now I can call the methods of Person on the Customer, let's try, first
//I need to create a Customer.
var myCustomer = new Customer('Dream Inc.');
myCustomer.sayMyName();

//If I add new methods to Person, they will be added to Customer, but if I
//add new methods to Customer they won't be added to Person. Example:
Customer.prototype.setAmountDue = function (amountDue) {
	this.amountDue = amountDue;
};
Customer.prototype.getAmountDue = function () {
	return this.amountDue;
};

//Let's try:
myCustomer.setAmountDue(2000);
alert(myCustomer.getAmountDue());

function Person(first, last, age, gender, interests) {
	this.name = {
		first,
		last,
	};
	this.age = age;
	this.gender = gender;
	this.interests = interests;
}

Person.prototype.bio = function () {
	// First define a string, and make it equal to the part of
	// the bio that we know will always be the same.
	let string = this.name.first + ' ' + this.name.last + ' is ' + this.age + ' years old. ';
	// define a variable that will contain the pronoun part of
	// the sencond sentence
	let pronoun;

	// check what the value of gender is, and set pronoun
	// to an appropriate value in each case
	if (this.gender === 'male' || this.gender === 'Male' || this.gender === 'm' || this.gender === 'M') {
		pronoun = 'He likes ';
	} else if (this.gender === 'female' || this.gender === 'Female' || this.gender === 'f' || this.gender === 'F') {
		pronoun = 'She likes ';
	} else {
		pronoun = 'They like ';
	}

	// add the pronoun string on to the end of the main string
	string += pronoun;

	// use another conditional to structure the last part of the
	// second sentence depending on whether the number of interests
	// is 1, 2, or 3
	if (this.interests.length === 1) {
		string += this.interests[0] + '.';
	} else if (this.interests.length === 2) {
		string += this.interests[0] + ' and ' + this.interests[1] + '.';
	} else {
		// if there are more than 2 interests, we loop through them
		// all, adding each one to the main string followed by a comma,
		// except for the last one, which needs an and & a full stop
		for (let i = 0; i < this.interests.length; i++) {
			if (i === this.interests.length - 1) {
				string += 'and ' + this.interests[i] + '.';
			} else {
				string += this.interests[i] + ', ';
			}
		}
	}

	// finally, with the string built, we alert() it
	alert(string);
};

Person.prototype.greeting = function () {
	alert("Hi! I'm " + this.name.first + '.');
};

Person.prototype.farewell = function () {
	alert(this.name.first + ' has left the building. Bye for now!');
};

let person1 = new Person('Tammi', 'Smith', 17, 'female', ['music', 'skiing', 'kickboxing']);

function Teacher(first, last, age, gender, interests, subject) {
	Person.call(this, first, last, age, gender, interests);

	this.subject = subject;
}

//*****This is imp
Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;

Teacher.prototype.greeting = function () {
	let prefix;

	if (this.gender === 'male' || this.gender === 'Male' || this.gender === 'm' || this.gender === 'M') {
		prefix = 'Mr.';
	} else if (this.gender === 'female' || this.gender === 'Female' || this.gender === 'f' || this.gender === 'F') {
		prefix = 'Mrs.';
	} else {
		prefix = 'Mx.';
	}

	alert('Hello. My name is ' + prefix + ' ' + this.name.last + ', and I teach ' + this.subject + '.');
};

let teacher1 = new Teacher('Dave', 'Griffiths', 31, 'male', ['football', 'cookery'], 'mathematics');

// Student class!

function Student(first, last, age, gender, interests) {
	Person.call(this, first, last, age, gender, interests);
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.greeting = function () {
	alert("Yo! I'm " + this.name.first + '.');
};

let student1 = new Student('Liz', 'Sheppard', 17, 'female', ['ninjitsu', 'air cadets']);
