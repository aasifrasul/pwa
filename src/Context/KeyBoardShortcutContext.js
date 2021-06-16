import * as React from 'react';

import useContextFactory from './useContextFactory';
import KeyBoardShortcutReducer from '../reducers/KeyBoardShortcutReducer';
import {GenericContext, contextProviderFactory} from './contextProviderFactory';

const initialState = {};

const KeyBoardShortcutProvider = (props) => contextProviderFactory(props, KeyBoardShortcutReducer, initialState);
const useKeyBoardShortcut = useContextFactory('KeyBoardShortcutProvider', GenericContext);

export { KeyBoardShortcutProvider, useKeyBoardShortcut };
