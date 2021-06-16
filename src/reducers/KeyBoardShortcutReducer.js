const KeyBoardShortcutReducer = (state, action) => {
	const { type, payload } = action;
	const { hash, obj, desc } = payload || {};
	switch (type) {
		case 'ADD_SHORTCUT':
			hash && (state[hash] = { obj, desc });
			return state;
		case 'REMOVE_SHORTCUT':
			hash && delete state[hash];
			return state;
		default:
			return state;
	}
};

export default KeyBoardShortcutReducer;
