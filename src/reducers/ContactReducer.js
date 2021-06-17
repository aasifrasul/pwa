const ContactReducer = (state, action) => {
	const { type, payload } = action;
	const { contacts } = state;
	switch (type) {
		case 'ADD_CONTACT':
			return {
				contacts: [...contacts, payload],
			};
		case 'DEL_CONTACT':
			return {
				contacts: contacts.filter((contact) => contact.id !== payload),
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
