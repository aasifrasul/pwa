const { mediaDevices } = window.navigator || {};
const { getUserMedia } = mediaDevices || {};

function hasGetUserMedia() {
	return !!getUserMedia;
}

const constraints = {
	video: true,
};

const video = document.querySelector('video');

try {
	if (window.navigator.mediaDevices.getUserMedia) {
		window.navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			video.srcObject = stream;
		});
	} else {
		alert('mediaDevices is not supported on your browser');
	}
} catch (e) {
	console.log(e);
}
