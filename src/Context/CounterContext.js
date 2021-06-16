import React, { useState, createContext } from 'react';

import useContextFactory from './useContextFactory';

// Create Context Object
export const CounterContext = createContext();

const { Provider } = CounterContext;

// Create a provider for components to consume and subscribe to changes
const CounterContextProvider = (props) => {
	const [count, setCount] = useState(0);

	return <Provider value={[count, setCount]}>{props.children}</Provider>;
};

const useCounterContext = useContextFactory('CounterContextProvider', CounterContext);

export { CounterContextProvider, useCounterContext };
