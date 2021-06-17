import React from 'react';

import ImplementKeyBoardShortcut from './ImplementKeyBoardShortcut';
import { KeyBoardShortcutContextProvider } from '../../Context/KeyBoardShortcutContext';

const KeyBoardShortcutPage = (props) => {
	return (
		<KeyBoardShortcutContextProvider>
			<ImplementKeyBoardShortcut />
		</KeyBoardShortcutContextProvider>
	);
};

export default KeyBoardShortcutPage;
