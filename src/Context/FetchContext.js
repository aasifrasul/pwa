import React, { useState, useReducer, useMemo, useContext, useEffect } from 'react';

import dataFetchReducer from '../reducers/dataFetchReducer';
import useContextFactory from './useContextFactory';
import { GenericContext, contextProviderFactory } from './contextProviderFactory';

const initialState = {
	isLoading: false,
	isError: false,
	data: {},
};

const { Provider } = GenericContext;

const FetchContextProvider = (props) => {
	const [state, dispatch] = useReducer(dataFetchReducer, initialState);
	const value = useMemo(() => [state, dispatch], [state]);

	return <Provider value={value}>{props.children}</Provider>;
};

const useFetchContext = (initialUrl, initialParams = {}, successCallback, failureCallback, skip = false) => {
	const [url, updateUrl] = useState(initialUrl);
	const [params, updateParams] = useState(initialParams);
	const [errorMessage, setErrorMessage] = useState('');
	const [refetchIndex, setRefetchIndex] = useState(0);
	const queryString = Object.keys(params)
		.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
		.join('&');

	const [state, dispatch] = useContext(GenericContext);

	const refetch = () => setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);
	const abortFetching = () => {
		console.log('Now aborting');
		// Abort.
		controller.abort();
	};

	useEffect(() => {
		const fetchData = async () => {
			if (skip) return;
			dispatch({ type: 'FETCH_INIT' });
			try {
				const urlToFetch = `${url}${queryString}`;
				const options = {
					method: 'GET',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'same-origin',
					/*headers: {
				      'Content-Type': 'application/json',
				      //...headers
				    },*/
					redirect: 'follow',
					referrerPolicy: 'no-referrer',
					//body: body ? JSON.stringify(data) : {},
					signal: controller.signal,
				};
				const response = await fetch(urlToFetch, options);
				const result = await response.json();
				if (response.ok) {
					dispatch({ type: 'FETCH_SUCCESS', payload: result });
					safeExecFunc(successCallback, result);
				} else {
					dispatch({ type: 'FETCH_FAILURE' });
					safeExecFunc(failureCallback, result);
				}
			} catch (err) {
				setErrorMessage(err.message);
				dispatch({ type: 'FETCH_FAILURE' });
				safeExecFunc(failureCallback, err);
			} finally {
				dispatch({ type: 'FETCH_STOP' });
			}
		};
		fetchData();
	}, [url, params, refetchIndex]);
	return {
		state,
		errorMessage,
		updateUrl,
		updateParams,
		refetch,
		abortFetching,
	};
};

export { FetchContextProvider, useFetchContext };
