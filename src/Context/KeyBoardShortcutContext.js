import * as React from 'react';

import useContextFactory from './useContextFactory';
import KeyBoardShortcutReducer from '../reducers/KeyBoardShortcutReducer';

const KeyBoardShortcutContext = React.createContext();

const { Provider } = KeyBoardShortcutContext;

function KeyBoardShortcutProvider(props) {
	const [state, dispatch] = React.useReducer(KeyBoardShortcutReducer, {});
	//const value = React.useMemo(() => ({ state, dispatch }), [state]);

	return <Provider value={[state, dispatch]}>{props.children}</Provider>;
}

const useKeyBoardShortcut = useContextFactory('KeyBoardShortcutProvider', KeyBoardShortcutContext);

export { KeyBoardShortcutProvider, useKeyBoardShortcut };
