import React from 'react';
import PropTypes from 'prop-types';

import KeyBoardShortcut from '../Common/KeyBoardShortcut/KeyBoardShortcut';
import Spacer from '../Common/Spacer/Spacer1';

import { useKeyBoardShortcut } from '../../Context/KeyBoardShortcutContext';

function ImplementKeyBoardShortcut(props) {
	const [state] = useKeyBoardShortcut();

	const toggleGreen = () => {
		document.body.style.backgroundColor = document.body.style.backgroundColor === 'green' ? '' : 'green';
		alert('toggleGreen Invoked');
	};

	const shiftP = () => {
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
				description="Turns the Background color of the Component to green"
			/>
		</>
	);
}

export default ImplementKeyBoardShortcut;
