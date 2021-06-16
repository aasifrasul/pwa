import React, { useContext } from 'react';

const useContextFactory = (name, context) => {
	return () => {
		const ctx = useContext(context);
		if (ctx === undefined) {
			throw new Error(`use${name}Context must be used withing a ${name}ContextProvider.`);
		}
		return ctx;
	};
};

export default useContextFactory;
