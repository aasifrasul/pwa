import * as React from 'react';

const useEffectOnlyOnce = (callback, dependencies, condition) => {
	const calledOnce = React.useRef(false);

	React.useEffect(() => {
		if (calledOnce.current) {
			return;
		}

		if (typeof condition === 'function' && condition(dependencies)) {
			typeof callback === 'function' && callback(dependencies);

			calledOnce.current = true;
		}
	}, [callback, condition, dependencies]);
};

export default useEffectOnlyOnce;
