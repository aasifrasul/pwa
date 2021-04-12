import React, { useState, useEffect, useRef } from 'react';

function stopwatch(props) {
	const seconds = useRef(0);
	const intervalID = useRef(0);
	const [timer, setTimer] = useState(0);

	const stopTimer = () => clearInterval(intervalID.current);

	useEffect(() => {
		console.log('Hi');
		intervalID.current = setInterval(
			() =>
				setTimer((timerCount) => {
					if (timerCount === 9) {
						timerCount = 0;
						seconds.current++;
					}
					return timerCount + 1;
				}),
			100
		);
		return stopTimer;
	}, []);
	const handleStop = () => (e) => stopTimer();
	const handleStart = () => (e) => console.log(timer);
	return (
		<div>
			{seconds.current} {timer}
			<button onClick={handleStop()}>Stop</button>
			<button onClick={handleStart()}>Start</button>
		</div>
	);
}

export default stopwatch;
