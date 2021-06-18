const KeyBoardShortcutReducer = (state, action) => {
	const { type, payload } = action;
	const { hash, obj, desc } = payload || {};
	switch (type) {
		case 'ADD_SHORTCUT':
			return {
				...state,
				[hash]: { obj, desc }
			}
		case 'REMOVE_SHORTCUT':
			delete state[hash];
			return {
				...state,
			}
		default:
			return {
				...state
			};
	}
};

export default KeyBoardShortcutReducer;
