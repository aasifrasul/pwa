import nestedCategoriesReducer from './nestedCategoriesReducer.js';
import wineConnoisseurReducer from './wineConnoisseurReducer.js';
import infiniteScrollReducer from './infiniteScrollReducer.js';
import movieListReducer from './movieListReducer.js';

import { safeExecFunc } from '../utils/typeChecking';

const reducers = {
	nestedCategories: nestedCategoriesReducer,
	wineConnoisseur: wineConnoisseurReducer,
	infiniteScroll: infiniteScrollReducer,
	movieList: movieListReducer,
};

const dataFetchReducer = (state = {}, action) => {
	const { schema } = action;
	const newState = {
		...state,
	};
	if (schema) {
		newState[schema] = safeExecFunc(reducers[schema], null, newState[schema], action);
	}
	return newState;
};

export default dataFetchReducer;
