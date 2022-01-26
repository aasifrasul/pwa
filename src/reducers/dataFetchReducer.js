const dataFetchReducer = (state = {}, action = {}) => {
	const { type, payload } = action;
	const { results } = payload || {};
	switch (type) {
		case 'FETCH_INIT':
			state = {
				...state,
				isLoading: true,
				isError: false,
			};
			return state;
		case 'FETCH_SUCCESS':
			state = {
				...state,
				isLoading: false,
				isError: false,
				data: [...state.data, ...results],
			};
			return state;
		case 'FETCH_FAILURE':
			state = {
				...state,
				isLoading: false,
				isError: true,
			};
			return state;
		case 'FETCH_STOP':
			state = {
				...state,
				isLoading: false,
			};
			return state;
		default:
			return {
				...state,
			};
	}
};

export default dataFetchReducer;
