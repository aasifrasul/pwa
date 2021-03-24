import React from 'react';

function useOffline() {
	const [isOffline, setIsOffline] = React.useState(false);

	function onOffline() {
		setIsOffline(true);
	}

	function onOnline() {
		setIsOffline(false);
	}

	React.useEffect(() => {
		window.addEventListener('offline', onOffline);
		window.addEventListener('online', onOnline);

		return () => {
			window.removeEventListener('offline', onOffline);
			window.removeEventListener('online', onOnline);
		};
	}, []);

	return isOffline;
}

export default useOffline;
