import React, { useState, useEffect, useRef, useReducer } from 'react';
import ReactDataGrid from 'react-data-grid';

import useFetch from '../../hooks/useFetch';
import useInfiniteScrollIO from '../../hooks/useInfiniteScrollIO';

import pageReducer from '../../reducers/pageReducer';
import { FetchStoreProvider, useFetchDispatch } from '../../Context/dataFetchContext';

import styles from './WineConnoisseur.css';

const baseURL = `http://localhost:3100/api/fetchWineData/`;

function DisplayList(props) {
	const [{ pageNum }, pagerDispatch] = useReducer(pageReducer, { pageNum: 0 });
	const ioObserverRef = useRef(null);
	const dispatch = useFetchDispatch();

	const url = `http://localhost:3100/api/fetchWineData/${pageNum}`;
	const { state, errorMessage, updateUrl } = useFetch(url, { schema: 'wineConnoisseur' });
	const { headers = [], pageData = [] } = state?.data || {};

	useEffect(() => {
		updateUrl(url);
	}, [pageNum]);

	useInfiniteScrollIO(ioObserverRef, () => pagerDispatch({ type: 'ADVANCE_PAGE' }));

	return (
		<div className={styles.alignCenter}>
			<span>Wine Connoisseur</span>
			<ReactDataGrid columns={headers} rows={pageData} rowsCount={10} minHeight={500} />
			<div ref={ioObserverRef}>Loading...</div>
		</div>
	);
}

const WineConnoisseur = (props) => (
	<FetchStoreProvider>
		<DisplayList {...props} />
	</FetchStoreProvider>
);

export default WineConnoisseur;
