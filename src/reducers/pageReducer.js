const pageReducer = (state, action) => {
	switch (action.type) {
		case 'ADVANCE_PAGE':
			return { ...state, pageNum: state.pageNum + 1 };
		default:
			return state;
	}
};

export default pageReducer;
