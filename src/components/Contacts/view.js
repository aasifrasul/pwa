import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import Form from './Form';
import Table from './Table';
import { StoreProvider } from '../../Context/ContactContext';

function Contacts() {
	return (
		<StoreProvider>
			<Segment basic>
				<Header as="h3">Contacts</Header>
				<Form />
				<Table />
			</Segment>
		</StoreProvider>
	);
}

export default Contacts;
