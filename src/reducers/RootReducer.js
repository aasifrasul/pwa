import { combineReducers } from 'redux';

import todoReducer from './todoReducer';
import dataFetchReducer from './dataFetchReducer';

const RootReducer = combineReducers({
	todoReducer,
	dataFetchReducer,
});

export default RootReducer;
