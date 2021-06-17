import React, { useState, useContext } from 'react';
import { Segment, Form, Input, Button } from 'semantic-ui-react';

import { useContactDispatch } from '../../Context/ContactContext';

export default function ContactForm() {
	const name = useFormInput('');
	const email = useFormInput('');
	// eslint-disable-next-line no-unused-vars
	const dispatch = useContactDispatch();

	const onSubmit = () => {
		dispatch({
			type: 'ADD_CONTACT',
			payload: { id: Math.floor(Math.random() * 1000), name: name.value, email: email.value },
		});
		// Reset Form
		name.onReset();
		email.onReset();
	};

	return (
		<Segment basic>
			<Form onSubmit={onSubmit}>
				<Form.Group widths="3">
					<Form.Field width={6}>
						<Input placeholder="Enter Name" {...name} required />
					</Form.Field>
					<Form.Field width={6}>
						<Input placeholder="Enter Email" {...email} type="email" required />
					</Form.Field>
					<Form.Field width={4}>
						<Button fluid primary>
							New Contact
						</Button>
					</Form.Field>
				</Form.Group>
			</Form>
		</Segment>
	);
}

function useFormInput(initialValue) {
	const [value, setValue] = useState(initialValue);

	const handleChange = (e) => {
		setValue(e.target.value);
	};

	const handleReset = () => {
		setValue('');
	};

	return {
		value,
		onChange: handleChange,
		onReset: handleReset,
	};
}
