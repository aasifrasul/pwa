const KeyBoardShortcutReducer = (state = {}, action = {}) => {
	const { type, payload } = action;
	switch (type) {
		case 'ADD_SHORTCUT':
			const { hash, obj, desc } = payload || {};
			state[hash] = { obj, desc };
			return state;
		case 'REMOVE_SHORTCUT':
			delete state[payload.hash];
			return state;
		default:
			return state;
	}
};

export default KeyBoardShortcutReducer;
