function createRangeIterator(start = 0, end = Infinity, step = 1) {
	let nextIndex = start;
	let iterationCount = 0;

	return {
		next() {
			let result;
			if (nextIndex < end) {
				result = { value: nextIndex, done: false };
				nextIndex += step;
				iterationCount++;
				return result;
			}
			return { value: iterationCount, done: true };
		},
	};
}

for (const num of range(1, 10)) {
	console.log(num);
}

const rangeIterator = range(1, 10)[Symbol.iterator]();
for (let result = rangeIterator.next(); !result.done; result = rangeIterator.next()) {
	console.log(result.value);
}

for (const num of [...range(1, 10)]) {
	console.log(num);
}
