import React from 'react';

import storeFactory from '../store/storeFactory';

import KeyBoardShortcutReducer from '../reducers/KeyBoardShortcutReducer';

const initialState = {};

const { StoreProvider, useStore, useDispatch } = storeFactory(KeyBoardShortcutReducer, initialState);

export { StoreProvider, useStore, useDispatch };
