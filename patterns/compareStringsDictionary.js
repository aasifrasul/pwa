function compareStrings(str1, str2) {
	const length = Math.min(str1.length, str2.length);

	for (let i = 0; i < length; i++) {
		const char1 = str1.charCodeAt(i);
		const char2 = str2.charCodeAt(i);

		if (char1 < char2) {
			return -1;
		} else if (char1 > char2) {
			return 1;
		}
	}

	// If the loop finishes, one string is a prefix of the other.
	// The shorter string comes first in dictionary order.
	if (str1.length < str2.length) {
		return -1;
	} else if (str1.length > str2.length) {
		return 1;
	}

	// Both strings are equal
	return 0;
}

// Example usage:
const string1 = 'apple';
const string2 = 'orange';

const result = compareStrings(string1, string2);

if (result < 0) {
	console.log(`${string1} comes before ${string2}`);
} else if (result > 0) {
	console.log(`${string1} comes after ${string2}`);
} else {
	console.log(`${string1} and ${string2} are equal`);
}
