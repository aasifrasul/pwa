import nestedCategoriesReducer from './nestedCategoriesReducer.js';
import wineConnoisseurReducer from './wineConnoisseurReducer.js';
import infiniteScrollReducer from './infiniteScrollReducer.js';
import movieListReducer from './movieListReducer.js';

const dataFetchReducer = (state, action) => {
	switch (action.schema) {
		case 'nestedCategories':
			return {
				...state,
				nestedCategories: nestedCategoriesReducer(state['nestedCategories'], action),
			};
			return state;
		case 'wineConnoisseur':
			return {
				...state,
				wineConnoisseur: wineConnoisseurReducer(state['wineConnoisseur'], action),
			};
		case 'infiniteScroll':
			return {
				...state,
				infiniteScroll: infiniteScrollReducer(state['infiniteScroll'], action),
			};
		case 'movieList':
			return {
				...state,
				movieList: movieListReducer(state['movieList'], action),
			};
		default:
			return {
				...state,
			};
	}
};

export default dataFetchReducer;
