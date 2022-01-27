import React, { useState, useEffect, useRef, useReducer } from 'react';

import useFetch from '../../hooks/useFetch';
import useImageLazyLoadIO from '../../hooks/useImageLazyLoadIO';
import useInfiniteScrollIO from '../../hooks/useInfiniteScrollIO';

import pageReducer from '../../reducers/pageReducer';
import { FetchStoreProvider, useFetchDispatch } from '../../Context/dataFetchContext';

import Movie from './Movie.js';

import { debounce } from '../../utils/throttleAndDebounce';

import styles from './MovieList.css';

function DisplayList() {
	const [{ pageNum }, pagerDispatch] = useReducer(pageReducer, { pageNum: 1 });
	const ioObserverRef = useRef(null);
	const dispatch = useFetchDispatch();

	const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${pageNum}`;
	const { state, errorMessage, updateUrl } = useFetch(url, Object.create(null), null, null);
	const { data = [], isLoading } = state || {};

	useEffect(() => {
		updateUrl(url);
	}, [pageNum]);

	useInfiniteScrollIO(ioObserverRef, () => pagerDispatch({ type: 'ADVANCE_PAGE' }));
	useImageLazyLoadIO('img[data-src]', data);

	function handleChange(e) {
		ioObserverRef.current = null;
		console.log(e.target.value);
		dispatch({ type: 'FILTER_BY_TEXT', payload: { filterText: e.target.value } });
	}

	return (
		<div>
			{isLoading && <p className="text-center">isLoading...</p>}
			<div>
				<input type="text" onChange={debounce(handleChange, 100)} />
			</div>
			<div>
				<div className={styles.container} id="container">
					{data.map((item, i) => (
						<Movie key={item?.id} item={item} styles={styles} />
					))}
				</div>
			</div>
			<div ref={ioObserverRef}>ABCD</div>
		</div>
	);
}

const MovieList = (props) => {
	return (
		<FetchStoreProvider>
			<DisplayList />
		</FetchStoreProvider>
	);
};

export default MovieList;
