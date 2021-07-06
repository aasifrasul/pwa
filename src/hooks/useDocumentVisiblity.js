import React, { useState, useEffect } from 'react';

export const useDocumentVisiblity = () => {
	const [visiblity, setVisiblity] = useState(() => document.visiblityState);

	useEffect(() => {
		const visiblitySetter = () => setVisiblity(document.visiblityState);
		document.addEventListener('visiblitychange', visiblitySetter);

		return () => {
			document.removeEventListener('visiblitychange', visiblitySetter);
		};
	}, []);

	return visiblity === 'visible' ? true : false;
};
