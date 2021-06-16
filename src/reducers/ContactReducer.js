const ContactReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'ADD_CONTACT':
			return {
				contacts: [...state.contacts, payload],
			};
		case 'DEL_CONTACT':
			return {
				contacts: state.contacts.filter((contact) => contact.id !== payload),
			};
		case 'START':
			return {
				loading: true,
			};
		case 'COMPLETE':
			return {
				loading: false,
			};
		default:
			throw new Error();
	}
};

export default ContactReducer;
