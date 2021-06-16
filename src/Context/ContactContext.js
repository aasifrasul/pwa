import React, { useReducer, createContext } from 'react';

import ContactReducer from '../reducers/ContactReducer';
import useContextFactory from './useContextFactory';
import {GenericContext, useProviderFactory} from './useProviderFactory';

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

const ContactContextProvider = (props) => useProviderFactory(props, ContactReducer, initialState);
const useContactContext = useContextFactory('ContactContextProvider', GenericContext);

export { ContactContextProvider, useContactContext };
