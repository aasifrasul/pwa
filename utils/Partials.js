const arr = [1, 3, 4, 5, 7, 8, 9, 10, 11, 13, 15, 16, 17, 18, 19];

function findContiguous(arr) {
	let iscontiguous = false,
		sidx,
		i;
	const res = [arr[0]];

	for (i = 1; i < arr.length; i++) {
		if (arr[i - 1] + 1 === arr[i]) {
			console.log('Contiguous of the last, ', arr[i]);
			if (iscontiguous == false) {
				sidx = i - 1;
				iscontiguous = true;
			}
		} else {
			console.log('Non Contiguous of the last, ', arr[i]);
			if (iscontiguous == true) {
				res.push(`${arr[sidx]}:${arr[i - 1]}`);
				res.push(arr[sidx - 1]);
			}

			iscontiguous = false;
		}
	}

	if (iscontiguous == true) {
		res.push(`${arr[sidx]}:${arr[i - 1]}`);
	}

	return res;
}

findContiguous(arr);
