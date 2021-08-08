import React from 'react';

import ImplementKeyBoardShortcut from './ImplementKeyBoardShortcut';
import { StoreProvider } from '../../Context/KeyBoardShortcutContext';

const KeyBoardShortcutPage = (props) => {
	return (
		<StoreProvider>
			<ImplementKeyBoardShortcut />
		</StoreProvider>
	);
};

export default KeyBoardShortcutPage;
