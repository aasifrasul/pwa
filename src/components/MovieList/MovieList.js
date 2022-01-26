import React, { useState, useEffect, useRef, useReducer } from 'react';

import useFetch from '../../hooks/useFetch';
import useImageLazyLoadIO from '../../hooks/useImageLazyLoadIO';
import useInfiniteScrollIO from '../../hooks/useInfiniteScrollIO';

import pageReducer from '../../reducers/pageReducer';

import Movie from './Movie.js';
import styles from './MovieList.css';

export default function MovieList() {
	const [{ pageNum }, pagerDispatch] = useReducer(pageReducer, { pageNum: 1 });
	const ioObserverRef = useRef(null);
	const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${pageNum}`;
	const { state, errorMessage, updateUrl } = useFetch(url, Object.create(null), null, null);

	useEffect(() => {
		updateUrl(url);
	}, [pageNum]);

	useInfiniteScrollIO(ioObserverRef, () => pagerDispatch({ type: 'ADVANCE_PAGE' }));
	useImageLazyLoadIO('img[data-src]', state.data);

	function handleChange(e) {
		console.log(e.target.value);
	}

	return (
		<div>
			{state.isLoading && <p className="text-center">isLoading...</p>}
			<div>
				<input type="text" onChange={handleChange} />
			</div>
			<div>
				<div className={styles.container} id="container">
					{state.data.map((item, i) => (
						<Movie key={item?.id} item={item} styles={styles} />
					))}
				</div>
			</div>
			<div ref={ioObserverRef}>ABCD</div>
		</div>
	);
}
