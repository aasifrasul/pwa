import React, { useState, useEffect, useRef } from 'react';

import useFetch from '../../hooks/useFetch';

import Movie from './Movie.js';
import styles from './MovieList.css';

export default function MovieList() {
	const [list, setList] = useState([]);
	const didMount = useRef();

	function failureCallback(res) {}

	function successCallback(res) {
		if (!isLoading && !isError && res.results) {
			setList(res.results);
		}
	}

	const { data, isError, isLoading } = useFetch(
		'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1',
		Object.create(null),
		successCallback,
		failureCallback
	);

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
		}

		return () => {
			didMount.current = false;
		};
	}, [list]);

	function handleChange(e) {
		console.log(e.target.value);
	}

	return (
		<div>
			<div>
				<input type="text" onChange={handleChange} />
			</div>
			<div id="list">
				<div className={styles.container}>
					{list.map((item) => (
						<Movie key={item.id} item={item} styles={styles} />
					))}
				</div>
			</div>
		</div>
	);
}
