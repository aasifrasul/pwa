import React, { useCallback, useEffect } from 'react';

import { safeExecFunc } from '../utils/typeChecking';

const useInfiniteScrollIO = (scrollRef, callback) => {
	const scrollObserver = useCallback(
		(node) => {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((en) => {
					if (en.intersectionRatio > 0) {
						safeExecFunc(callback, null, null);
					}
				});
			});
			observer.observe(node);
		},
		[callback]
	);

	useEffect(() => {
		scrollRef.current && scrollObserver(scrollRef.current);
		return () => {
			scrollRef.current = null;
		};
	}, [scrollObserver, scrollRef]);
};

export default useInfiniteScrollIO;
