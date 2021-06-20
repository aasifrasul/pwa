import React from 'react';

import storeFactory from '../store/storeFactory';

import GlobalReducer from '../reducers/GlobalReducer';

const initialState = {};

const [GlobalContextProvider, useGlobalStore, useGlobalDispatch] = storeFactory(GlobalReducer, initialState);

export { GlobalContextProvider, useGlobalStore, useGlobalDispatch };
