const { mediaDevices } = window.navigator || {};
function hasGetUserMedia() {
	debugger;
	return !!(mediaDevices && mediaDevices.getUserMedia);
}

const constraints = {
	video: true,
};

const video = document.querySelector('video');

try {
	if (hasGetUserMedia()) {
		mediaDevices.getUserMedia(constraints).then((stream) => {
			video.srcObject = stream;
		});
	} else {
		alert('mediaDevices is not supported on your browser');
	}
} catch (e) {
	console.log(e);
}
