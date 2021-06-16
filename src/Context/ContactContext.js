import React, { useReducer, createContext } from 'react';

import ContactReducer from '../reducers/ContactReducer';
import useContextFactory from './useContextFactory';

export const ContactContext = createContext();

const { Provider } = ContactContext;

const initialState = {
	contacts: [
		{
			id: '098',
			name: 'Diana Prince',
			email: 'diana@us.army.mil',
		},
		{
			id: '099',
			name: 'Bruce Wayne',
			email: 'bruce@batmail.com',
		},
		{
			id: '100',
			name: 'Clark Kent',
			email: 'clark@metropolitan.com',
		},
	],
	loading: false,
	error: null,
};

const ContactContextProvider = (props) => {
	const [state, dispatch] = useReducer(ContactReducer, initialState);

	return <Provider value={[state, dispatch]}>{props.children}</Provider>;
};

const useContactContext = useContextFactory('ContactContextProvider', ContactContext);

export { ContactContextProvider, useContactContext };
