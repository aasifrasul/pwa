function stringReplace(templcateString, jsonData) {
	let result;

	if (typeof templcateString !== 'string' || typeof jsonData !== 'string') {
		throw new Error('Params should be string');
	}

	try {
		const data = JSON.parse(jsonData);
		result = String(templcateString);

		Object.keys(data).forEach((key) => {
			result = result.replace(`{{${key}}}`, data[key]);
		});
	} catch (err) {
		console.log(err);
	}

	return result;
}
