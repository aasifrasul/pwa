const wsUri = 'ws://echo.websocket.org/';
const socket = new WebSocket(wsUri);

socket.binaryType = 'arrayBuffer';
// socket.binaryType = 'blob';

// get text view and button for submitting the message
const textsend = document.querySelector('#text-view');
const submitMsg = document.querySelector('#tsend-button');
const buttonStop = document.querySelector('#stop-button');

socket.onopen = function (event) {
	console.log('Connection established');
	// Display user friendly messages for the successful establishment of connection
	const label = document.querySelector('#status');
	label.innerHTML = 'Connection established';
};

//Handling the click event
submitMsg.onclick = function () {
	// Send the data
	socket.send(textsend.value);
};

//Handling the click event
buttonStop.onclick = function () {
	// Close the connection if open
	if (socket.readyState === WebSocket.OPEN) {
		socket.close();
	}
};

socket.onclose = function (event) {
	console.log('Error occurred.');

	if (event.code != 1000) {
		// Error code 1000 means that the connection was closed normally.
		// Try to reconnect.

		if (!navigator.onLine) {
			alert('You are offline. Please connect to the Internet and try again.');
		}
	}
	// Inform the user about the error.
	var label = document.querySelector('#status');
	label.innerHTML = 'Error: ' + event;
};

socket.onmessage = function (event) {
	if (typeof event.data === String) {
		//create a JSON object
		var jsonObject = JSON.parse(event.data);
		var username = jsonObject.name;
		var message = jsonObject.message;

		console.log('Received data string');
	} else if (event.data instanceof ArrayBuffer) {
		var buffer = event.data;
		console.log('Received arraybuffer');
	}
};

// socket.close(1000,'Deliberate Connection');

// window.addEventListener('load', init, false);
