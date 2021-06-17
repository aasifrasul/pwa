import React from 'react';

import useContextFactory from '../Context/useContextFactory';

export default function storeFactory(reducer, initialState) {
	const storeContext = React.createContext();
	const dispatchContext = React.createContext();

	const StoreProvider = ({ children }) => {
		const [store, dispatch] = React.useReducer(reducer, initialState);
		const value = React.useMemo(() => [store, dispatch], [store]);

		return (
			<dispatchContext.Provider value={value[1]}>
				<storeContext.Provider value={value[0]}>{children}</storeContext.Provider>
			</dispatchContext.Provider>
		);
	};

	const useStore = useContextFactory('dispatchContext.Provider', storeContext);
	const useDispatch = useContextFactory('dispatchContext.Provider', dispatchContext);

	return [StoreProvider, useStore, useDispatch];
}
