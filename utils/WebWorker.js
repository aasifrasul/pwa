self.addEventListener(
	'message',
	(e) => {
		console.log('Data received from main Thread', e.data);
	},
	false
);
