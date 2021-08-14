import React from 'react';
import PropTypes from 'prop-types';

import KeyBoardShortcut from '../Common/KeyBoardShortcut/KeyBoardShortcut';
import Spacer from '../Common/Spacer/Spacer1';

import { useKeyBoardShortcutStore } from '../../Context/KeyBoardShortcutContext';

const getBGColor = () => document.body.style.backgroundColor;

function ImplementKeyBoardShortcut(props) {
	const state = useKeyBoardShortcutStore();

	const toggleGreen = () => {
		document.body.style.backgroundColor = getBGColor() === 'green' ? '' : 'green';
		alert('toggleGreen Invoked');
	};

	const shiftP = () => {
		document.body.style.backgroundColor = getBGColor() === 'red' ? '' : 'red';
		console.log('shift P invoked');
	};

	return (
		<>
			<div>{JSON.stringify(state)}</div>
			<Spacer size={16} />
			<KeyBoardShortcut
				combo="shift s"
				callback={toggleGreen}
				description="Turns the Background color of the Component to green"
			/>
			<Spacer size={16} />
			<KeyBoardShortcut
				combo="shift p"
				callback={shiftP}
				description="Turns the Background color of the Component to red"
			/>
		</>
	);
}

export default ImplementKeyBoardShortcut;
