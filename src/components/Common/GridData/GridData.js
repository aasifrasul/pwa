import React, { useState, useEffect, useRef } from 'react';
import ReactDataGrid from 'react-data-grid';
import socketClient from 'socket.io-client';

import { getArrayCount } from '../../../utils/typeChecking';

const socket = socketClient.connect('http://localhost:3100');

const columns = [
	{ key: 'key', name: 'Currency Pair' },
	{ key: 'value', name: 'Ratio' },
];

function GridData(props) {
	const { queue } = props;
	const [rows, setRows] = useState([]);
	const didMount = useRef(false);
	let rafId;

	function setRowsData() {
		const data = [];
		let res;
		while (data.length < 50) {
			res = queue.dequeue();
			console.log('res', res);
			data.push(res);
		}
		didMount.current && getArrayCount(data) && setRows(data);
		window.cancelAnimationFrame(rafId);
		//rafId = window.requestAnimationFrame(setRowsData);
	}

	function enqueue(data) {
		queue.enqueue(data);
	}

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;

			socket.emit('fetchCurrencyPair');
			socket.on('currencyPairData', enqueue);

			const myWorker = new Worker('WebWorker.js');
			myWorker.postMessage('Helloooo');
			console.log('myWorker', myWorker);
			myWorker.onmessage = (e) => {
				console.log('myWorker', e.data);
			};

			rafId = window.requestAnimationFrame(setRowsData);
		}

		return () => {
			didMount.current = false;
			window.cancelAnimationFrame(rafId);
		};
	}, []);
	return <ReactDataGrid columns={columns} rows={rows} rowsCount={20} minHeight={150} />;
}

export default GridData;
