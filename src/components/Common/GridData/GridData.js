import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';

import { getArrayCount } from '../../../utils/typeChecking';

const columns = [
	{ key: 'key', name: 'Currency Pair' },
	{ key: 'value', name: 'Ratio' },
];

function GridData(props) {
	const { socket, queue } = props;
	const [rows, setRows] = useState([]);
	const didMount = React.useRef(false);
	let rafId;

	socket.on('currencyPairData', (data) => {
		while (getArrayCount(data)) {
			queue.enqueue(data.splice(0, 30));
		}
	});

	function setRowsData() {
		const data = queue.dequeue();
		didMount.current && getArrayCount(data) && setRows(data);
		rafId = window.requestAnimationFrame(setRowsData);
	}

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
		}

		rafId = window.requestAnimationFrame(setRowsData);

		return () => {
			didMount.current = false;
			window.cancelAnimationFrame(rafId);
		};
	});
	return <ReactDataGrid columns={columns} rows={rows} rowsCount={20} minHeight={150} />;
}

export default GridData;
