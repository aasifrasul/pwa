import React, { useState, useMemo } from 'react';

import useInterval from '../../hooks/useInterval';

const Home = (props) => {
	const [seconds, setSeconds] = useState(0);

	useInterval(() => {
		setSeconds((n) => ++n);
	}, 1000);

	const handleClick = () => props.handleShow();

	return (
		<div onClick={handleClick}>
			<p>{seconds}</p>
		</div>
	);
};

export default Home;
