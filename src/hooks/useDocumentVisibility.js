import React, { useState, useEffect } from 'react';

export const useDocumentVisibility = () => {
	const [visibility, setVisibility] = useState(() => document.visibilityState);

	useEffect(() => {
		const visibilityChangeHandler = () => setVisibility(document.visibilityState);
		document.addEventListener('visibilitychange', visibilityChangeHandler);

		return () => {
			document.removeEventListener('visibilitychange', visibilityChangeHandler);
		};
	}, []);

	return visibility === 'visible';
};
