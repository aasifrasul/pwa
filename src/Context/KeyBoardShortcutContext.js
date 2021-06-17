import React from 'react';

import storeFactory from '../store/storeFactory';

import KeyBoardShortcutReducer from '../reducers/KeyBoardShortcutReducer';

const initialState = {};

const [KeyBoardShortcutContextProvider, useKeyBoardShortcutStore, useKeyBoardShortcutDispatch] = storeFactory(KeyBoardShortcutReducer, initialState);

export { KeyBoardShortcutContextProvider, useKeyBoardShortcutStore, useKeyBoardShortcutDispatch };
