import React from 'react';

import storeFactory from '../store/storeFactory';

import GlobalReducer from '../reducers/GlobalReducer';

const initialState = {};

const { StoreProvider, useStore, useDispatch } = storeFactory(GlobalReducer, initialState);

export { StoreProvider, useStore, useDispatch };
