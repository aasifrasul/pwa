import React, { useState, useMemo } from 'react';

import useInterval from '../../hooks/useInterval';

const Home = () => {
	const [seconds, setSeconds] = useState(0);

	useInterval(() => {
		setSeconds((n) => ++n);
	}, 1000);

	return <p>{seconds}</p>;
};

export default Home;
