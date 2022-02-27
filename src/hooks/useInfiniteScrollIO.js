import React, { useCallback, useEffect } from 'react';

import { safeExecFunc } from '../utils/typeChecking';

const useInfiniteScrollIO = (scrollRef, callback) => {
	const scrollObserver = useCallback(
		(node) =>
			new IntersectionObserver((entries) =>
				entries.forEach((entry) => entry.intersectionRatio > 0 && safeExecFunc(callback))
			).observe(node),
		[scrollRef]
	);

	useEffect(() => {
		scrollRef?.current && scrollObserver(scrollRef.current);
		return () => scrollRef?.current && (scrollRef.current = null);
	}, [scrollObserver, scrollRef]);
};

export default useInfiniteScrollIO;
