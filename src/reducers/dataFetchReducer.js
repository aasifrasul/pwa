const dataFetchReducer = (state = {}, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case 'FETCH_INIT':
			state = {
				data: [],
				isLoading: true,
				isError: false,
			};
			return state;
		case 'FETCH_SUCCESS':
			state = {
				isLoading: false,
				isError: false,
				data: payload,
			};
			return state;
		case 'FETCH_FAILURE':
			state = {
				data: payload,
				isLoading: false,
				isError: true,
			};
			return state;
		case 'FETCH_STOP':
			state = {
				data: payload,
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
