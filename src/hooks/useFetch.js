import { useState, useEffect, useReducer, useMemo } from 'react';

import { useFetchStore, useFetchDispatch } from '../Context/dataFetchContext';
import { safeExecFunc } from '../utils/typeChecking';

const controller = new AbortController();

const useFetch = (initialUrl, initialParams = {}, successCallback, failureCallback, skip = false) => {
	const [url, updateUrl] = useState(initialUrl);
	const [params, updateParams] = useState(initialParams);
	const [errorMessage, setErrorMessage] = useState('');
	const [refetchIndex, setRefetchIndex] = useState(0);
	const queryString = Object.keys(params)
		.map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
		.join('&');

	const state = useFetchStore();
	const dispatch = useFetchDispatch();

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
				const response = await fetch(`${url}${queryString}`, options);
				const result = await response.json();
				if (response.ok) {
					dispatch({ type: 'FETCH_SUCCESS', payload: result });
					safeExecFunc(successCallback, null, result);
				} else {
					dispatch({ type: 'FETCH_FAILURE' });
					safeExecFunc(failureCallback, null, result);
				}
			} catch (err) {
				setErrorMessage(err.message);
				dispatch({ type: 'FETCH_FAILURE' });
				safeExecFunc(failureCallback, null, err);
			} finally {
				dispatch({ type: 'FETCH_STOP' });
			}
		};

		fetchData();

		return () => {
			// abortFetching();
		};
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

export default useFetch;
