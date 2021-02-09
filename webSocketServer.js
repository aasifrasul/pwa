const server = new WebSocketServer('ws://localhost:8181');
const clients = Object.create(null);

server.Start((socket) => {
	socket.OnOpen = () => {
		// Add the incoming connection to our list.
		clients.Add(socket);
	};

	// Handle the other events here...
});

socket.OnClose = () => {
	// Remove the disconnected client from the list.
	clients.Remove(socket);
};

socket.OnMessage = () => {
	for (var client in clients) {
		// Send the message to everyone!
		// Also, send the client connection's unique identifier in order
		// to recognize who is who.
		client.Send(client.ConnectionInfo.Id + ' says: ' + message);
	}
};
