import React from 'react';

import ImplementKeyBoardShortcut from './ImplementKeyBoardShortcut';
import { KeyBoardShortcutProvider } from '../../Context/KeyBoardShortcutContext';

const KeyBoardShortcutPage = (props) => {
	return (
		<KeyBoardShortcutProvider>
			<ImplementKeyBoardShortcut />
		</KeyBoardShortcutProvider>
	);
};

export default KeyBoardShortcutPage;
