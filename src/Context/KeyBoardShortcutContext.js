import * as React from 'react';

import KeyBoardShortcutReducer from '../reducers/KeyBoardShortcutReducer';

const KeyBoardShortcutContext = React.createContext({ state: {}, dispatch: () => {} });

const { Provider } = KeyBoardShortcutContext;

function KeyBoardShortcutProvider({ children }) {
	let state, dispatch;
	[state, dispatch] = React.useReducer(KeyBoardShortcutReducer, {});
	[state, dispatch] = React.useMemo(() => [state, dispatch], [state]);

	return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

function useKeyBoardShortcut() {
	const context = React.useContext(KeyBoardShortcutContext);

	if (context === undefined) {
		throw new Error('useKeyBoardShortcut must be used within a KeyBoardShortcutProvider');
	}

	return context;
}

export { KeyBoardShortcutProvider, useKeyBoardShortcut };
