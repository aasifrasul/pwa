import React from 'react';

import useContextFactory from '../Context/useContextFactory';

export default function storeFactory(reducer, initialState) {
	const storeContext = React.createContext();
	const dispatchContext = React.createContext();

	const StoreProvider = ({ children }) => {
		let store, dispatch;
		function useMemoCB() {
			return { store, dispatch };
		}
		[store, dispatch] = React.useReducer(reducer, initialState);
		({ store, dispatch } = React.useMemo(useMemoCB, [store, dispatch]));

		return (
			<dispatchContext.Provider value={dispatch}>
				<storeContext.Provider value={store}>{children}</storeContext.Provider>
			</dispatchContext.Provider>
		);
	};

	const useStore = useContextFactory('dispatchContext.Provider', storeContext);
	const useDispatch = useContextFactory('dispatchContext.Provider', dispatchContext);

	return [StoreProvider, useStore, useDispatch];
}
