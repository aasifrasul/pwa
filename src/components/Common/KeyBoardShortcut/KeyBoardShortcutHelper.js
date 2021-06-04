import keypress from 'keypress.js';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

class KeyBoardShortcutHelper {
	static displayName = 'KeyBoardShortcutHelper';
	static instance = null;

	static getInstance() {
		if (!KeyBoardShortcutHelper.instance) {
			KeyBoardShortcutHelper.instance = new KeyBoardShortcutHelper();
		}

		return KeyBoardShortcutHelper.instance;
	}

	constructor() {
		this.listener = new keypress.Listener();
	}

	getListenerInstance() {
		return this.listener;
	}

	generateHash(length = 10) {
		let result = '';

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}
}

export default KeyBoardShortcutHelper;
