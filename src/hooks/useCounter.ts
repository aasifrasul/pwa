import { useState } from 'react';

//maintains a counter value with increment and decrement function
//if initial count value is not passed takes 0 as default
const useCounter = (initCount: number = 0) => {
	const [count, setCount] = useState(initCount);

	function increment() {
		setCount((count) => count + 1);
	}
	function decrement() {
		setCount((count) => count - 1);
	}
	function reset(value: number) {
		setCount(value);
	}

	return {
		count,
		increment,
		decrement,
		reset,
	};
};

export default useCounter;
