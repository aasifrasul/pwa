const todoReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'TODO_COMPLETE':
			return state.map((todo, key) => {
				if (key === payload.id) {
					return { ...todo, complete: true };
				} else {
					return todo;
				}
			});
		case 'TODO_UNCOMPLETE':
			return state.map((todo, key) => {
				if (key === payload.id) {
					return { ...todo, complete: false };
				} else {
					return todo;
				}
			});
		case 'TODO_SHOW_UNCOMPLETED':
			return state.filter((todo) => !todo.complete);
		case 'TODO_SHOW_COMPLETED':
			return state.filter((todo) => todo.complete);
		case 'TODO_ADD_NEW':
			return [...state, { text: payload.value, complete: false }];
		case 'TODO_DELETE':
			return state.filter((todo) => todo.id !== payload.id);
		default:
			return state;
	}
};

export default todoReducer;
