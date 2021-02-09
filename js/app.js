'use srict';

(function () {
	const getJSON = (url) =>
		fetch(url).then(
			(res) => res.json(),
			(err) => new Error(`Some Error Occurred ${err}`)
		);

	const spawnWorker = (fn, params) => {
		const str = '`' + params.join('`, `') + '`';
		const blob = new Blob(['(' + fn + ')(' + str + ')']);
		const blobURL = URL.createObjectURL(blob);
		const worker = new Worker(blobURL);
		URL.revokeObjectURL(blobURL);
		return worker;
	};

	const loadJSON = (path) => {
		return fetch(path).then((response) => {
			if (response.status == 200) {
				return response.json();
			} else {
				throw new HttpError(response);
			}
		});
	};

	const loadDynamically = ['js/states.json', 'js/countries.json', 'js/twoWayBinding.js'];

	loadJS('SWRegistration.js').then((script) => {
		console.info('script', script);
		if (navigator.serviceWorker) {
			navigator.serviceWorker.ready.then(console.log);
			navigator.serviceWorker.onmessage = (e) => console.log(e);
		}
	});
	/*
    loadJS('loadSW.js').then(() => {
      console.log(`Service Worker Loading script loaded`)
    });
  */
	loadDynamically.map(loadJS);

	if (!Worker) {
		const importScriptWorker = new Worker('importScriptWorker.js');
		importScriptWorker.postMessage(loadDynamically);
		loadDynamically.map((item) => importScriptWorker.postMessage(item));
	}

	//Using Shared Worker

	if (!SharedWorker) {
		mySharedWorker = new SharedWorker('shared-worker.js');
		mySharedWorker.port.start();
		mySharedWorker.port.postMessage('From Shared Worker');
		mySharedWorker.port.onmessage = (msg) => console.log(msg.data);
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

	const spawn = (generatorFunc) => {
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

	const createAsyncFunction = (fn) => {
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
						return Promise.resolve(value).then(
							(value) => step('next', value),
							(err) => step('throw', err)
						);
					}
				}
				return step('next');
			});
		};
	};

	spawn(function* () {
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
			  self.postMessage(e.data);
			}, false);`,
		]);

		// Obtain a blob URL reference to our worker 'file'.
		const blobURL = window.URL.createObjectURL(blob);

		const worker = new Worker(blobURL);
		const date = new Date();
		worker.onmessage = (e) => console.info(e.data);
		const arrBuf = new ArrayBuffer(8);

		worker.postMessage(
			{
				arrBuf,
				date,
				arrBuf,
			},
			[arrBuf]
		);
		window.URL.revokeObjectURL(blobURL);
	};

	function imgLoad(url) {
		// Create new promise with the Promise() constructor;
		// This has as its argument a function
		// with two parameters, resolve and reject
		return new Promise(function (resolve, reject) {
			// Standard XHR to load an image
			var request = new XMLHttpRequest();
			request.open('GET', url);
			request.responseType = 'blob';
			// When the request loads, check whether it was successful
			request.onload = function () {
				if (request.status === 200) {
					// If successful, resolve the promise by passing back the request response
					resolve(request.response);
				} else {
					// If it fails, reject the promise with a error message
					reject(Error("Image didn't load successfully; error code:" + request.statusText));
				}
			};
			request.onerror = function () {
				// Also deal with the case when the entire request fails to begin with
				// This is probably a network error, so reject the promise with an appropriate message
				reject(Error('There was a network error.'));
			};
			// Send the request
			request.send();
		});
	}

	const body = document.querySelector('body');
	let myDiv = document.createElement('div');
	let imageURL;

	imgLoad('/static/images/mario.png').then(
		(response) => {
			let myImage = new Image();
			imageURL = window.URL.createObjectURL(response);
			myImage.src = imageURL;
			myDiv.appendChild(myImage);
			body.appendChild(myDiv);
		},
		(Error) => {
			console.log(Error);
		}
	);

	imgLoad('/static/images/Dubai-Al-Arab.webp').then(
		(response) => {
			let myImage = new Image();
			imageURL = window.URL.createObjectURL(response);
			myImage.src = imageURL;
			myDiv.appendChild(myImage);
			body.appendChild(myDiv);
		},
		(Error) => {
			console.log(Error);
		}
	);

	// createInlineWorker();
})();
