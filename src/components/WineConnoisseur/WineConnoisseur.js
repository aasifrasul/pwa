import React, { useState, useEffect, useRef } from 'react';
import ReactDataGrid from 'react-data-grid';

import useFetch from '../../hooks/useFetch';

import styles from './WineConnoisseur.css';

const baseURL = `http://localhost:3100/api/fetchWineData/`;

export default function WineConnoisseur(props) {
	const [page, setPage] = useState(0);
	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);

	const successCallback = (res) => {
		const { headers, pageData } = res;
		headers && setColumns(headers);
		pageData && setRows([...rows, ...pageData]);
	};

	const failureCallback = () => {
		console.log('IN failureCallback');
	};

	useEffect(() => {}, [page, rows]);

	const { state, errorMessage, updateUrl } = useFetch(
		`${baseURL}${page}`,
		Object.create(null),
		successCallback,
		failureCallback
	);

	const clickHandler = () => (e) => {
		e.preventDefault();
		setPage(page + 1);
		updateUrl(`${baseURL}${page + 1}`);
	};

	return (
		<div className={styles.alignCenter}>
			<span>Wine Connoisseur</span>
			<span>
				<button className={styles.button} onClick={clickHandler()}>
					Next
				</button>
			</span>
			<ReactDataGrid columns={columns} rows={rows} rowsCount={20} minHeight={150} />
		</div>
	);
}
