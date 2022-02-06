import React, { useState, useEffect, useRef, useReducer } from 'react';

import useFetch from '../../hooks/useFetch';
import useImageLazyLoadIO from '../../hooks/useImageLazyLoadIO';
import useInfiniteScrollIO from '../../hooks/useInfiniteScrollIO';

import pageReducer from '../../reducers/pageReducer';
import { FetchStoreProvider, useFetchDispatch } from '../../Context/dataFetchContext';

import InputText from '../Common/InputText';
import Movie from './Movie.js';

import { debounce, throttle } from '../../utils/throttleAndDebounce';

import styles from './MovieList.css';

function DisplayList() {
	const [{ pageNum }, pagerDispatch] = useReducer(pageReducer, { pageNum: 1 });
	const ioObserverRef = useRef(null);
	const searchRef = useRef('');
	const dispatch = useFetchDispatch();
	const debouncedHandleChange = debounce(handleChange, 100);

	const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${pageNum}`;
	const { state, errorMessage, updateUrl } = useFetch(url, Object.create(null), null, null);
	const { data = [], isLoading } = state || {};

	useEffect(() => {
		updateUrl(url);
	}, [pageNum]);

	useInfiniteScrollIO(ioObserverRef, () => pagerDispatch({ type: 'ADVANCE_PAGE' }));
	useImageLazyLoadIO('img[data-src]', data);

	function handleChange(value) {
		ioObserverRef.current = null;
		console.log(value);
		dispatch({ type: 'FILTER_BY_TEXT', payload: { filterText: value } });
	}

	return (
		<div>
			<div>
				<InputText
					label="Search Item:"
					defaultValue={searchRef.current}
					inputTextRef={searchRef}
					callback={debouncedHandleChange}
				/>
			</div>
			{isLoading && <p className="text-center">isLoading...</p>}
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
