'use srict';

(function() {
	const loadJS = async src => {
		console.log('Script Invoked', src);
		const ref = document.querySelectorAll('script')[0];
		const script = document.createElement('script');
		script.setAttribute('src', src);
		script.setAttribute('defer', true);
		script.setAttribute('async', true);
		script.setAttribute('crossorigin', 'anonymous');
		ref.parentNode.insertBefore(script, ref);
		script.onload = await function(e) {
			console.log('load', e);
			console.log('Script Resolved', src);
		};
		script.onerror = await function(err) {
			console.log('Script Rejected', src, err);
		};
	};
	const getJSON = url => fetch(url).then(res => res.json(), err => new Error(`Some Error Occurred ${err}`));

	const spawnWorker = (fn, params) => {
		const str = '`' + params.join('`, `') + '`';
		const blob = new Blob(['(' + fn + ')(' + str + ')']);
		const blobURL = URL.createObjectURL(blob);
		const worker = new Worker(blobURL);
		URL.revokeObjectURL(blobURL);
		return worker;
	};

	const loadJSON = path => {
		return fetch(path).then(response => {
			if (response.status == 200) {
				return response.json();
			} else {
				throw new HttpError(response);
			}
		});
	};

	const loadDynamically = ['js/states.json', 'js/countries.json'];

	loadJS('SWRegistration.js').then(() => {
		navigator.serviceWorker.ready.then(console.log);
		navigator.serviceWorker.onmessage = e => console.log(e);
	});

	loadDynamically.map(loadJS);

	if (Worker) {
		// const importScriptWorker = new Worker('importScriptWorker.js');
		// importScriptWorker.postMessage(loadDynamically);
		// loadDynamically.map(item => importScriptWorker.postMessage(item));
	}

	//Using Shared Worker

	if (SharedWorker) {
		mySharedWorker = new SharedWorker('shared-Worker.js');
		mySharedWorker.port.start();
		mySharedWorker.port.postMessage('From Shared Worker');
		mySharedWorker.port.onmessage = msg => console.log(msg.data);
	}

	/*
	document
	  .querySelector('.cache-article')
	  .addEventListener('click', (event) => {
		event.preventDefault();
		var id = this.dataset.articleId;
		caches.open('mysite-article-' + id).then((cache) => {
		  fetch('/get-article-urls?id=' + id).then((response) => {
			// /get-article-urls returns a JSON-encoded array of
			// resource URLs that a given article depends on
			return response.json();
		  }).then((urls) => {
			cache.addAll(urls);
		  });
		});
	  });
	*/

	const spawn = generatorFunc => {
		const continuer = (verb, arg) => {
			let result;
			try {
				result = generator[verb](arg);
			} catch (err) {
				return Promise.reject(err);
			}
			if (result.done) {
				return result.value;
			} else {
				return Promise.resolve(result.value).then(onFulfilled, onRejected);
			}
		};
		const generator = generatorFunc();
		const onFulfilled = continuer.bind(continuer, 'next');
		const onRejected = continuer.bind(continuer, 'throw');
		return onFulfilled();
	};

	const createAsyncFunction = fn => {
		return () => {
			const gen = fn.apply(this, arguments);
			return new Promise((resolve, reject) => {
				function step(key, arg) {
					try {
						var info = gen[key](arg);
						var value = info.value;
					} catch (error) {
						reject(error);
						return;
					}
					if (info.done) {
						resolve(value);
					} else {
						return Promise.resolve(value).then(value => step('next', value), err => step('throw', err));
					}
				}
				return step('next');
			});
		};
	};

	spawn(function*() {
		try {
			// 'yield' effectively does an async wait,
			// returning the result of the promise
			//let story = yield getJSON('https://api.github.com/users/aasifrasul');
			/*
			return [
			  "https://api.github.com/users/aasifrasul/followers",
			  "https://api.github.com/users/aasifrasul/following",
			  "https://api.github.com/users/aasifrasul/gists",
			  "https://api.github.com/users/aasifrasul/subscriptions",
			  "https://api.github.com/users/aasifrasul/repos",
			].reduce((sequence, url) => {
			  // Once the last chapter's promise is done…
			  return sequence.then(() => {
				// …fetch the next chapter
				return getJSON(url);
			  }).then((chapter) => {
				// and add it to the page
				console.log(chapter);
			  });
			}, Promise.resolve());
			*/
		} catch (err) {
			// try/catch just works, rejected promises are thrown here
			console.log('Argh, broken: ' + err.message);
		}
	});

	const createInlineWorker = () => {
		const blob = new Blob([
			//"onmessage = function(e) { postMessage('msg from worker'); }"
			`self.addEventListener('message', (e) => {
			  importScripts('https://img1a.flixcart.com/www/linchpin/batman-returns/fingerprint/glMatrix.min.js');
			  self.postMessage(e.data);
			}, false);`
		]);

		// Obtain a blob URL reference to our worker 'file'.
		const blobURL = window.URL.createObjectURL(blob);

		const worker = new Worker(blobURL);
		const date = new Date();
		worker.onmessage = e => console.info(e.data);
		const arrBuf = new ArrayBuffer(8);

		worker.postMessage(
			{
				arrBuf,
				date,
				arrBuf
			},
			[arrBuf]
		);
		window.URL.revokeObjectURL(blobURL);
	};

	createInlineWorker();
})();
