import * as React from 'react';

import useContextFactory from './useContextFactory';
import KeyBoardShortcutReducer from '../reducers/KeyBoardShortcutReducer';
import {GenericContext, useProviderFactory} from './useProviderFactory';

const initialState = {};

const KeyBoardShortcutProvider = (props) => useProviderFactory(props, KeyBoardShortcutReducer, initialState);
const useKeyBoardShortcut = useContextFactory('KeyBoardShortcutProvider', GenericContext);

export { KeyBoardShortcutProvider, useKeyBoardShortcut };
