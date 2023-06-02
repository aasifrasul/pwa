const connected = document.querySelector('#connected');
const log = document.querySelector('#log');
const chat = document.querySelector('#chat');
const form = chat.form;
const state = document.querySelector('#status');

if (window.WebSocket === undefined) {
	state.innerHTML = 'sockets not supported';
	state.className = 'fail';
} else {
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function (str) {
			return this.indexOf(str) == 0;
		};
	}

	window.addEventListener('load', onLoad, false);
}

function onLoad() {
	const wsUri = 'ws://127.0.0.1:7777';
	websocket = new WebSocket(wsUri);
	websocket.onopen = function (evt) {
		onOpen(evt);
	};
	websocket.onclose = function (evt) {
		onClose(evt);
	};
	websocket.onmessage = function (evt) {
		onMessage(evt);
	};
	websocket.onerror = function (evt) {
		onError(evt);
	};
}

function onOpen(evt) {
	state.className = 'success';
	state.innerHTML = 'Connected to server';
}

function onClose(evt) {
	state.className = 'fail';
	state.innerHTML = 'Not connected';
	connected.innerHTML = '0';
}

function onMessage(evt) {
	// There are two types of messages:
	// 1. a chat participant message itself
	// 2. a message with a number of connected chat participants
	const message = evt.data;

	if (message.startsWith('log:')) {
		message = message.slice('log:'.length);
		log.innerHTML = '<li class = "message">' + message + '</li>' + log.innerHTML;
	} else if (message.startsWith('connected:')) {
		message = message.slice('connected:'.length);
		connected.innerHTML = message;
	}
}

function onError(evt) {
	state.className = 'fail';
	state.innerHTML = 'Communication error';
}

function addMessage() {
	const message = chat.value;
	chat.value = '';
	websocket.send(message);
}
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// Set display size (css pixels).
const size = 200;
canvas.style.width = size + 'px';
canvas.style.height = size + 'px';

// Set actual size in memory (scaled to account for extra pixel density).
const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
canvas.width = size * scale;
canvas.height = size * scale;

// Normalize coordinate system to use css pixels.
ctx.scale(scale, scale);

ctx.fillStyle = '#bada55';
ctx.fillRect(10, 10, 300, 300);
ctx.fillStyle = '#ffffff';
ctx.font = '18px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const x = size / 2;
const y = size / 2;

const textString = 'I love MDN';
ctx.fillText(textString, x, y);
