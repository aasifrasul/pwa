import React, { useState, useEffect, useRef } from 'react';

import styles from './MovieList.css';

export default function MovieList() {
	const [data, setData] = useState([]);
	const didMount = useRef();
	let items = undefined;

	const handleMouseenter = (e) => {
		console.log(e.target);
	};

	useEffect(() => {
		let wrapper;

		if (!didMount.current) {
			didMount.current = true;

			fetch(
				'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1'
			)
				.then((res) => res.json())
				.then((res) => {
					const { results } = res || {};
					console.log(results);
					setData(results);
				})
				.catch((e) => {
					throw new Error(e);
				});
		} else {
			wrapper = document.querySelector(`.${styles.imageWrapper}`);
			wrapper && wrapper.addEventListener('mouseenter', handleMouseenter, false);
		}

		return () => {
			wrapper && wrapper.removeEventListener('mouseenter', handleMouseenter, false);
		};
	}, []);

	items = data.map((item) => {
		const { id, poster_path, title, vote_average, overview } = item;
		const imagePath = `https://image.tmdb.org/t/p/w1280${poster_path}`;
		return (
			<div className={styles.imageWrapper} key={id}>
				<div className={styles.image}>
					<img src={imagePath} width="150" height="200" />
				</div>
				<div>
					{title} {vote_average}
				</div>
			</div>
		);
	});

	function handleChange(e) {
		console.log(e.target.value);
	}

	return (
		<div>
			<div>
				<input type="text" onChange={handleChange} />
			</div>
			<div id="list">
				<div className={styles.container}>{items}</div>
			</div>
		</div>
	);
}
