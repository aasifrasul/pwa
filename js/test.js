(function () {
	let loaderCount = 0;
	const queue = [];
	const timeIntervalIds = {};

	const showLoader = (e) => {
		console.log(e);
		let count = 0;
		loaderCount++;
		addLoader(loaderCount);
		loaderCount > 1 && queue.push(loaderCount);
		let key = `loader${loaderCount}`;
		let loader = document.querySelector(`#${key}`);
		const startLoader = (key) =>
			(timeIntervalIds[key] = setInterval(displayLoader, 100, key));
		const displayLoader = (key) => {
			loader.style.maxWidth = `${count * 20}px`;
			if (++count === 30) {
				clearInterval(timeIntervalIds[key]);
				delete timeIntervalIds[key];
				if (queue.length) {
					key = `loader${queue.shift()}`;
					loader = document.querySelector(`#${key}`);
					count = 0;
					startLoader(key);
				}
			}
		};
		Object.keys(timeIntervalIds).length === 0 && startLoader(key);
	};

	const addLoader = (no) => {
		const loaders = document.querySelector('#loaders');
		const div = document.createElement('div');
		div.setAttribute('id', `loader${no}`);
		div.setAttribute('class', `loader`);
		loaders.appendChild(div);
	};

	Promise.all([
		loadJS(`${window.location.origin}/utils/PromiseFactory.js`),
		loadJS(`${window.location.origin}/patterns/AyncQueue.js`),
	]).then(() => {
		const factory = new PromiseFactory();
		factory.add('ABC');
		const promise = factory.get('ABC');
		promise.resolve(1234);
		//promise.fetchResolvedData('ABC');
		// loadJSON('https://api.github.com/users/aasifrasul').then(data => console.log(data));
		document.querySelector('#button').addEventListener('click', showLoader);
	});
})();
