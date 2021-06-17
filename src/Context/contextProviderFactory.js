import React from 'react';

export const GenericContext = React.createContext();

const { Provider } = GenericContext;

export const contextProviderFactory = (props, Reducer, initialState = {}) => {
	const [state, dispatch] = React.useReducer(Reducer, initialState);
	const value = React.useMemo(() => [state, dispatch], [state]);

	return <Provider value={value}>{props.children}</Provider>;
};
