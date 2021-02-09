function createWorkerFallback(workerUrl) {
	var worker = null;
	try {
		var blob;
		try {
			blob = new Blob(["importScripts('" + workerUrl + "');"], {
				type: 'application/javascript',
			});
		} catch (e) {
			var blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
			blobBuilder.append("importScripts('" + workerUrl + "');");
			blob = blobBuilder.getBlob('application/javascript');
		}
		var url = window.URL || window.webkitURL;
		var blobUrl = url.createObjectURL(blob);
		worker = new Worker(blobUrl);
	} catch (e1) {
		//if it still fails, there is nothing much we can do
	}
	return worker;
}

function createWorker() {
	var worker = null;
	try {
		if (testSameOrigin(workerUrl)) {
			worker = new Worker(workerUrl);
			worker.onerror = function (event) {
				event.preventDefault();
				worker = createWorkerFallback(workerUrl);
			};
		} else {
			worker = createWorkerFallback(workerUrl);
		}
	} catch (e) {
		worker = createWorkerFallback(workerUrl);
	}
}

function testSameOrigin(url) {
	var loc = window.location;
	var a = document.createElement('a');
	a.href = url;
	return a.hostname === loc.hostname && a.port === loc.port && a.protocol === loc.protocol;
}
