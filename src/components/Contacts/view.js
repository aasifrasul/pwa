import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import Form from './Form';
import Table from './Table';
import { ContactContextProvider } from '../../Context/ContactContext';

export default function Contacts() {
	return (
		<ContactContextProvider>
			<Segment basic>
				<Header as="h3">Contacts</Header>
				<Form />
				<Table />
			</Segment>
		</ContactContextProvider>
	);
}
