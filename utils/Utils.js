const toArray = (args) => Array.prototype.slice.call(args);

new Array(10).fill(0);
// creates an array with 10 zeroes
// [0, ,0, 0, 0, 0, 0, 0, 0, 0, 0]

Array.from(Array(10).keys());
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Array.apply(null, { length: N }).map(Number.call, Number);
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

Array.apply(null, { length: N }).map(Function.call, Math.random);

// Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP etc)
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

// Generate numbers range 0..4
range(0, 4, 1);
// [0, 1, 2, 3, 4]

// Generate numbers range 1..10 with step of 2
range(1, 10, 2);
// [1, 3, 5, 7, 9]

// Generate the alphabet using Array.from making use of it being ordered as a sequence
range('A'.charCodeAt(0), 'Z'.charCodeAt(0), 1).map((x) => String.fromCharCode(x));
// ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

const generateRandomNumber = (min = 0, max = 100) => Math.round(Math.random() * (max - min) + min);

function addSubtract(n) {
	let sum = n;
	let count = 0;
	const f = function f(m) {
		++count;
		m *= count % 2 ? +1 : -1;
		console.log('count', count);
		console.log('m', m);
		sum += m;
		return f;
	};
	f.toString = function () {
		return sum;
	};
	return f;
}

function sum(...args) {
	const newFunc = sum.bind(null, ...args);
	newFunc.toString = function () {
		args.reduce((a, c) => a + c, 0);
	};
	//const valueOf = () => args.reduce((a, c) => a + c, 0);
	//const updatedFunc = Object.assign(newFunc, { valueOf });
	return newFunc;
}

function infiniteMultiplication(n) {
	let res = n;
	const f = function f(m) {
		res *= m;
		return f;
	};
	f.toString = () => res;
	return f;
}

function isPrime(n) {
	if (n === 1 || n === 2) {
		return true;
	}
	if (n % 2 === 0) {
		return false;
	}
	let divisor = 3;

	while (divisor < n / 2) {
		if (n % divisor === 0) {
			return false;
		}
		divisor += 2;
	}
	return true;
}

function primeFactors(n) {
	let factors = {},
		divisor = 3;
	if (n === 1 || n === 2) {
		return true;
	}
	if (n % 2 === 0) {
		factors[2] = 2;
	}
	while (n > 2) {
		if (n % divisor == 0) {
			factors[divisor] = divisor;
			n = n / divisor;
		} else {
			divisor += 2;
		}
	}
	return Object.keys(factors);
}

const greatestCommonDivisor = (a, b) => (b == 0 ? a : greatestCommonDivisor(b, a % b));

function mergeSortedArray(a, b) {
	let merged = [],
		aElm = a[0],
		bElm = b[0],
		i = 1,
		j = 1;

	if (a.length == 0) return b;
	if (b.length == 0) return a;
	/* 
  if aElm or bElm exists we will insert to merged array
  (will go inside while loop)
   to insert: aElm exists and bElm doesn't exists
			 or both exists and aElm < bElm
	this is the critical part of the example            
  */
	while (aElm || bElm) {
		if ((aElm && !bElm) || aElm < bElm) {
			merged.push(aElm);
			aElm = a[i++];
		} else {
			merged.push(bElm);
			bElm = b[j++];
		}
	}
	return merged;
}

function firstNonRepeatChar(str) {
	let len = str.length,
		char,
		charCount = {};
	for (let i = 0; i < len; i++) {
		char = str[i];
		if (charCount[char]) {
			charCount[char]++;
		} else charCount[char] = 1;
	}
	for (const j in charCount) {
		if (charCount[j] == 1) return j;
	}
}

function countZeroes(n) {
	let count = 0;
	while (n > 0) {
		count += Math.floor(n / 10);
		n = n / 10;
	}
	return count;
}

function findSubString(str, subStr) {
	let idx = 0,
		i = 0,
		j = 0,
		len = str.length,
		subLen = subStr.length;

	for (; i < len; i++) {
		if (str[i] == subStr[j]) j++;
		else j = 0;

		//check starting point or a match
		if (j == 0) idx = i;
		else if (j == subLen) return idx;
	}

	return -1;
}

function permutations(str) {
	let arr = str.split(''),
		len = arr.length,
		perms = [],
		rest,
		picked,
		restPerms,
		next;

	if (len == 0) return [str];

	for (let i = 0; i < len; i++) {
		rest = Object.create(arr);
		picked = rest.splice(i, 1);

		restPerms = permutations(rest.join(''));

		for (let j = 0, jLen = restPerms.length; j < jLen; j++) {
			next = picked.concat(restPerms[j]);
			perms.push(next.join(''));
		}
	}
	return perms;
}

Object.compare = (obj1, obj2) => {
	let p;
	for (p in obj1) {
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

		switch (typeof obj1[p]) {
			case 'object':
				if (!Object.compare(obj1[p], obj2[p])) return false;
				break;
			case 'function':
				if (typeof obj2[p] == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString()))
					return false;
				break;
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}

	for (p in obj2) {
		if (typeof obj1[p] == 'undefined') return false;
	}
	return true;
};

const isAnagaram = (str1, str2) => {
	const hash = (str) =>
		Array.prototype.slice.call(str).reduce((hash, item) => {
			hash[item] = item;
			return hash;
		}, {});
	const hash1 = hash(str1);
	const hash2 = hash(str2);
	for (key in hash1) {
		if (!hash2[key]) {
			return false;
		}
	}
	for (key in hash2) {
		if (!hash1[key]) {
			return false;
		}
	}
	return true;
};

function binarySearch(items, value) {
	let startIndex = 0,
		stopIndex = items.length - 1,
		middle = Math.floor((stopIndex + startIndex) / 2);

	while (items[middle] != value && startIndex < stopIndex) {
		//adjust search area
		if (value < items[middle]) {
			stopIndex = middle - 1;
		} else if (value > items[middle]) {
			startIndex = middle + 1;
		}

		//recalculate middle
		middle = Math.floor((stopIndex + startIndex) / 2);
	}

	//make sure it's the right value
	return items[middle] != value ? -1 : middle;
}

// Compare 2 Objects
// Irrespective of order of the keys
function isEqual(a, b) {
	const aProps = Object.getOwnPropertyNames(a),
		bProps = Object.getOwnPropertyNames(b);

	if (aProps.length != bProps.length) {
		return false;
	}

	for (let i = 0; i < aProps.length; i++) {
		const propName = aProps[i];

		if (a[propName] !== b[propName]) {
			return false;
		}
	}
	return true;
}

// Move Left Animation
function moveLeft(elem, distance) {
	let left = 0;

	function frame() {
		left++;
		elem.style.left = `${left}px`;

		if (left == distance) clearInterval(timeId);
	}

	var timeId = setInterval(frame, 10);
}

Function.prototype.curry =
	Function.prototype.curry ||
	function () {
		const args = Array.prototype.slice.call(arguments, 0);
		if (args.length < 1) {
			return this;
		}
		const self = this;
		return function () {
			return self.apply(this, args.concat(toArray(arguments)));
		};
	};

// Currying
function curry(fn) {
	if (fn.length <= 1) return fn;
	const generator = (...args) => {
		if (fn.length === args.length) {
			return fn(...args);
		} else {
			return (...args2) => {
				return generator(...args, ...args2);
			};
		}
	};
	return generator;
}

function compose() {
	var args = toArray(arguments);
	var start = args.length - 1;
	return function () {
		var i = start;
		var result = args[start].apply(this, arguments);
		while (i--) result = args[i].call(this, result);
		return result;
	};
}

// Create a magic object var obj = {}
// console.log(obj.a, obj.a, obj.a);
// 1 2 3

let obj = {
	_initValue: 0,
	get a() {
		return ++this._initValue;
	},
};

var obj = Object.create(null);

Object.defineProperty(obj, 'a', {
	get: (function () {
		let initValue = 0;
		return function () {
			return ++initValue;
		};
	})(),
});

console.log(obj.a, obj.a, obj.a);

let initValue = 0;
let obj = new Proxy(
	{},
	{
		get: function (item, property, itemProxy) {
			return property === 'a' ? ++initValue : item[property];
		},
	},
);
console.log(obj.a, obj.a, obj.a);

const type_of = (someVariable) => Object.prototype.toString.call(someVariable).slice(8, -1).toLowerCase();

function throttled(delay, fn) {
	let lastCall = 0;
	return function (...args) {
		const now = new Date().getTime();
		if (now - lastCall < delay) {
			return;
		}
		lastCall = now;
		return fn(...args);
	};
}

function debounced(delay, fn) {
	let timerId;
	return function (...args) {
		timerId && clearTimeout(timerId);
		timerId = setTimeout(() => {
			fn(...args);
			timerId = null;
		}, delay);
	};
}

(function () {
	const throttle = (func, limit) => {
		let lastFunc;
		let lastRan;
		return function () {
			const context = this;
			const args = arguments;
			if (!lastRan) {
				func.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(
					function () {
						if (Date.now() - lastRan >= limit) {
							func.apply(context, args);
							lastRan = Date.now();
						}
					},
					limit - (Date.now() - lastRan),
				);
			}
		};
	};
})();

function slow(x) {
	// there can be a heavy CPU-intensive job here
	console.info(`Called with ${x}`);
	return x;
}

const cachingDecorator = (func) => {
	let cache = new Map();

	return function (x) {
		const key = `${func.name}.${x}`;
		if (cache.has(key)) {
			// if the result is in the map
			return cache.get(key); // return it
		}

		// const result = func(x); // otherwise call func
		// const result = func.call(this, x); // otherwise call func
		// const result = func.call(context, ...args); // pass an array as list with spread operator
		const result = func.apply(context, args); // is same as using apply

		cache.set(key, result); // and cache (remember) the result
		return result;
	};
};

slow = cachingDecorator(slow);
/*
console.info(slow(1)); // slow(1) is cached
console.info('Again: ' + slow(1)); // the same

console.info(slow(2)); // slow(2) is cached
console.info('Again: ' + slow(2)); // the same as the previous line
*/

const isRequired = () => {
	throw new Error('param is required');
};
const print = (num = isRequired()) => {
	console.log(`printing ${num}`);
};
print(2); //printing 2
print(); // error
print(null); //printing null

// Execute a function only once
const executeOnce = function executeOnce(func) {
	let result;
	return function (...params) {
		return result || (result = func.apply(this, params));
	};
};

const memoize = function memoize(func) {
	const hash = new Map();
	return function (...params) {
		const key = JSON.stringify(params);
		if (!hash.has(key)) {
			hash.set(key, func.apply(this, params));
		}
		return hash.get(key);
	};
};

/**
 * Returns a function that, when called,
 * returns a generator object that is immediately
 * ready for input via `next()`
 */
function coroutine(generatorFunction) {
	return function (...args) {
		const generatorObject = generatorFunction(...args);
		generatorObject.next();
		return generatorObject;
	};
}

const wrapped = coroutine(function* () {
	console.log(`First input: ${yield}`);
	return 'DONE';
});
