function findTheTimeToBuyTickets(arr, pos) {
	let i = -1,
		count = 0,
		len = arr.length;
	while (++i < len) {
		count += pos < i ? Math.min(arr[i], arr[pos]) : Math.min(arr[i], arr[pos] - 1);
		console.log('i, arr[i], count', i, arr[i], count);
	}

	return count;
}

findTheTimeToBuyTickets([2, 3, 4, 5, 1, 5, 8], 3);
