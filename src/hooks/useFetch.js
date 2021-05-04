import { useState, useEffect, useReducer } from 'react';

import dataFetchReducer from '../reducers/dataFetchReducer';

const controller = new AbortController();

const useFetch = (initialUrl, initialParams = {}, successCallback, failureCallback, skip = false) => {
	const [url, updateUrl] = useState(initialUrl);
	const [params, updateParams] = useState(initialParams);
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setHasError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [refetchIndex, setRefetchIndex] = useState(0);
	const queryString = Object.keys(params)
		.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
		.join('&');

	const [state, dispatch] = useReducer(dataFetchReducer, {
		isLoading: false,
		isError: false,
		data: Object.create(null),
	});

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
				const response = await fetch(urlToFetch, {
					method: 'get',
					signal: controller.signal,
				});
				const result = await response.json();
				if (response.ok) {
					dispatch({ type: 'FETCH_SUCCESS', payload: result });
					typeof successCallback === 'function' && successCallback(result);
				} else {
					dispatch({ type: 'FETCH_FAILURE' });
					typeof successCallback === 'function' && failureCallback(result);
				}
			} catch (err) {
				setErrorMessage(err.message);
				dispatch({ type: 'FETCH_FAILURE' });
				typeof successCallback === 'function' && failureCallback(err);
			} finally {
				dispatch({ type: 'FETCH_STOP' });
			}
		};
		fetchData();
	}, [url, params, refetchIndex]);
	return {
		data,
		isLoading,
		isError,
		errorMessage,
		updateUrl,
		updateParams,
		refetch,
		abortFetching,
	};
};

export default useFetch;
