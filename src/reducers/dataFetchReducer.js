const dataFetchReducer = (state = {}, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case 'FETCH_INIT':
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				isError: false,
				data: payload,
			};
		case 'FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case 'FETCH_STOP':
			return {
				...state,
				isLoading: false,
			};
		default:
			return {
				...state,
			};
	}
};

export default dataFetchReducer;
