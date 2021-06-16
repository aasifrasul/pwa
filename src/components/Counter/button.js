import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import { CounterContext } from '../../Context/CounterContext';

const CustomButton = (props) => {
	const { text, color, callback } = props;
	return (
		<Button color={color} onClick={callback()}>
			{text}
		</Button>
	);
};

export default function CounterButtons() {
	const [count, setCount] = useContext(CounterContext);

	const increment = () => () => setCount(count + 1);
	const decrement = () => () => setCount(count - 1);

	return (
		<div>
			<Button.Group>
				<CustomButton text="Add" color="green" callback={increment} />
				<CustomButton text="Minus" color="red" callback={decrement} />
			</Button.Group>
		</div>
	);
}
