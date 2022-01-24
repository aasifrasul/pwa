import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import UserCard from './UserCard';

import styles from './InfiniteScroll.css';

const TOTAL_PAGES = 25;
const PAGE_SIZE = 10;

const InfiniteScroll = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [allUsers, setAllUsers] = useState([]);
	const [pageNum, setPageNum] = useState(1);
	const [lastElement, setLastElement] = useState(null);

	const options = {
		root: document.querySelector('#scrollArea'),
		rootMargin: '0px',
		threshold: 1.0,
	};

	const scrollObserver = useRef(
		new IntersectionObserver((entries) => {
			entries[0]?.isIntersecting && window.requestIdleCallback(() => setPageNum((no) => no + 1));
		}, options)
	);

	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(({ target: img }) =>
			window.requestIdleCallback(() => {
				img.setAttribute('src', img.getAttribute('data-attr-src'));
				img.removeAttribute('data-attr-src');
				observer.unobserve(img);
			})
		);
	}, options);

	const fetchUserData = async () => {
		setIsLoading(true);
		const response = await axios.get(`https://randomuser.me/api/?page=${pageNum}&results=${PAGE_SIZE}&seed=asf`);
		setAllUsers([...allUsers, ...response?.data?.results]);
		setIsLoading(false);
	};

	useEffect(() => {
		if (pageNum <= TOTAL_PAGES) {
			fetchUserData();
		}

		const images = document.querySelectorAll('img[data-attr-src]');

		images && images.forEach((img) => imageObserver?.observe(img));
	}, [pageNum]);

	useEffect(() => {
		const currentObserver = scrollObserver.current;

		lastElement && currentObserver?.observe(lastElement);

		return () => lastElement && currentObserver?.unobserve(lastElement);
	}, [lastElement]);

	return (
		<div className={styles.scrollParent}>
			<h1 className="text-3xl text-center mt-4 mb-10">All users</h1>

			<div className={styles.scrollArea}>
				{allUsers.map((user, i) => {
					return i === (pageNum - 1) * PAGE_SIZE ? (
						<div key={`${user.name?.first}-${i}`} ref={setLastElement}>
							<UserCard data={user} />
						</div>
					) : (
						<UserCard data={user} key={`${user.name?.first}-${i}`} />
					);
				})}
			</div>
			{isLoading && <p className="text-center">isLoading...</p>}
			{pageNum - 1 === TOTAL_PAGES && <p className="text-center my-10">♥</p>}
		</div>
	);
};

export default InfiniteScroll;
