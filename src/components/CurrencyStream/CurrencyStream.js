import React, { useEffect, useState } from 'react';
import socketClient from 'socket.io-client';

import GridData from '../Common/GridData/GridData';
import OSStatistics from '../Common/OSStatistics/OSStatistics';

import queue from '../../utils/SPQueue';

const socket = socketClient.connect('http://localhost:3100');
socket.emit('fetchCurrencyPair');

function CurrencyStream(props) {
	return (
		<div>
			<OSStatistics />
			<GridData queue={queue} socket={socket} />
		</div>
	);
}

export default CurrencyStream;
