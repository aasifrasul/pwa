import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';

import useFetch from '../../hooks/useFetch';
import useImageLazyLoadIO from '../../hooks/useImageLazyLoadIO';
import useInfiniteScrollIO from '../../hooks/useInfiniteScrollIO';

import pageReducer from '../../reducers/pageReducer';

import { FetchStoreProvider } from '../../Context/dataFetchContext';

import UserCard from './UserCard';

import styles from './InfiniteScroll.css';

const TOTAL_PAGES = 25;
const PAGE_SIZE = 10;

const DisplayList = () => {
	const [{ pageNum }, pagerDispatch] = useReducer(pageReducer, { pageNum: 1 });
	const url = `https://randomuser.me/api/?page=${pageNum}&results=${PAGE_SIZE}&seed=asf`;
	const { state, errorMessage, updateUrl } = useFetch(url, Object.create(null), null, null);
	const ioObserverRef = useRef(null);

	useEffect(() => {
		updateUrl(url);
	}, [pageNum]);

	useInfiniteScrollIO(ioObserverRef, () => pagerDispatch({ type: 'ADVANCE_PAGE' }));
	useImageLazyLoadIO('img[data-src]', state.data);

	return (
		<div className={styles.scrollParent}>
			<h1 className="text-3xl text-center mt-4 mb-10">All users</h1>
			<div className={styles.scrollArea}>
				{state.data.map((user, i) => (
					<UserCard data={user} key={`${user.name?.first}-${i}`} />
				))}
			</div>
			{state.isLoading && <p className="text-center">isLoading...</p>}
			{pageNum - 1 === TOTAL_PAGES && <p className="text-center my-10">♥</p>}
			<div ref={ioObserverRef}>ABCD</div>
		</div>
	);
};

const InfiniteScroll = (props) => {
	return (
		<FetchStoreProvider>
			<DisplayList />
		</FetchStoreProvider>
	);
};

export default InfiniteScroll;
