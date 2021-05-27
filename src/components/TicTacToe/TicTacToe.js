import React, { useState } from 'react';

export default function tictactoe(props) {
	const [chance, setChance] = useState(0);
	// const [data, setChance] = useState(0);
	let data = {};
	let count = 0;
	let item = 0;
	let lastItem = '';
	const allowedOptions = ['O', 'X'];

	const handleChange = (key) => (e) => {
		let value = e.target.value || '';
		value = value.toUpperCase();
		if (lastItem === value) {
			alert('Please select the other value');
			return;
		}
		if (!allowedOptions.includes(value)) {
			alert('Please add either X or O');
			return;
		}
		data[key] = {
			chance,
			value,
		};
		setChance(Number(!chance));
		lastItem = value;
	};

	console.log('data', data);

	const html = [1, 2, 3].map(() => (
		<div>
			{[1, 2, 3].map(() => {
				const { value } = data[++count] || {};
				return (
					<span>
						<input type="text" value={value} disabled={!!value} onChange={handleChange(count)} />
					</span>
				);
			})}
		</div>
	));

	return (
		<>
			<div>Player {chance + 1}</div>
			{html}
		</>
	);
}
