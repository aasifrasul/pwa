import { createStore, applyMiddleware, compose } from 'redux';

import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/RootReducer';

// ToDo: Clean up Redux dev-tools integration
const composeEnhancers = (window || {}).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunkMiddleware];

const configureStore = (preloadedState = {}) =>
	createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(...middlewares)));

export default configureStore;
