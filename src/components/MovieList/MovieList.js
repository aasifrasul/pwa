import React, { useState, useEffect, useRef } from 'react';

import useFetch from '../../hooks/useFetch';

import Movie from './Movie.js';
import styles from './MovieList.css';

export default function MovieList() {
	const [list, setList] = useState([]);
	const [pageNum, setPageNum] = useState(1);
	const didMount = useRef();
	const [lastElement, setLastElement] = useState(null);

	const options = {
		root: document.querySelector('#container'),
		rootMargin: '0px',
		threshold: 1.0,
	};

	const scrollObserver = useRef(
		new IntersectionObserver((entries) => {
			entries[0]?.isIntersecting && window.requestIdleCallback(() => setPageNum((no) => no + 1));
		}, options)
	);

	function failureCallback(res) {}

	function successCallback(res) {
		const { results } = res;
		results && setList([...list, ...results]);
	}

	const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${pageNum}`;

	const { state, errorMessage, updateUrl } = useFetch(url, Object.create(null), successCallback, failureCallback);

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
		}

		updateUrl(url);

		return () => {
			didMount.current = false;
		};
	}, [pageNum]);

	useEffect(() => {
		const currentObserver = scrollObserver.current;

		lastElement && currentObserver?.observe(lastElement);

		return () => lastElement && currentObserver?.unobserve(lastElement);
	}, [lastElement]);

	function handleChange(e) {
		console.log(e.target.value);
	}

	return (
		<div>
			<div>
				<input type="text" onChange={handleChange} />
			</div>
			<div>
				<div className={styles.container} id="container">
					{list.map((item, i) => {
						return i === (pageNum - 1) * 20 ? (
							<div key={item.id} ref={setLastElement}>
								<Movie item={item} styles={styles} />
							</div>
						) : (
							<Movie key={item.id} item={item} styles={styles} />
						);
					})}
				</div>
			</div>
		</div>
	);
}
