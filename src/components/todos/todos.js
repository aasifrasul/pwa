import React, { useState, useEffect, useReducer } from 'react';

import CombinedRefCheckbox from '../Common/Checkbox/CombinedRefCheckbox';
import InputText from '../Common/InputText';

import todoReducer from '../../reducers/todoReducer';

const initialTodos = [{ text: 'Item 1', complete: false }];

function ToDos(props) {
	const [value, setValue] = useState('');
	const [checked, setChecked] = useState('');
	// const [todos, setTodos] = useState([{ text: 'Item 1', complete: false }]);
	const [todos, dispatch] = useReducer(todoReducer, initialTodos);

	useEffect(() => {
	}, [value, checked]);

	const todosHtml = todos.filter((item, key) => {
		let include = false;
		include = checked ? item.complete
		return ((checked && item.complete) || (!checked && !item.complete)) &&(
			<div key={key}>
				<span>{item.text}</span>
				<span onClick={() => handleDelete(key)}> Delete </span>
				<span onClick={() => handleComplete(key)}> Complete </span>
			</div>
		);
	});

	const handleChange = (data) => data && setValue(data);

	function handleSubmit(event) {
		event.preventDefault();
		if (value) {
			dispatch({ type: 'TODO_ADD_NEW', payload: { value } });
			setValue('');
		}
	}

	function handleRemoveFromComplete(key) {
		dispatch({ type: 'TODO_UNCOMPLETE', payload: { id: key } });
	}

	function handleDelete(key) {
		dispatch({ type: 'TODO_DELETE', payload: { id: key } });
	}

	function handleComplete(key) {
		dispatch({ type: 'TODO_COMPLETE', payload: { id: key } });
	}

	const handleShowCompleted = (isChecked, val) => setChecked(isChecked);

	return (
		<React.Fragment>
			<CombinedRefCheckbox name="Show Completed:" label="Show Completed:" callback={handleShowCompleted} />
			<form onSubmit={handleSubmit}>
				<InputText label="Add Item:" defaultValue={value} callback={handleChange} />
				<input type="submit" value="Submit" />
				<div>All the Todos</div>
				<div>{todosHtml}</div>
			</form>
		</React.Fragment>
	);
}

export default ToDos;
