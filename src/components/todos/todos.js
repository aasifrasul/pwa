import React, { useState, useEffect, useReducer, useRef } from 'react';

import CombinedRefCheckbox from '../Common/Checkbox/CombinedRefCheckbox';
import InputText from '../Common/InputText';

import todoReducer from '../../reducers/todoReducer';

const initialTodos = Array.from({ length: 100 }, (_, i) => ({ text: `Item ${i + 1}`, complete: false }));

function ToDos(props) {
	const todosHtml = [];
	const inputTextRef = useRef('');
	const searchRef = useRef('');
	const [checked, setChecked] = useState('');
	const [todos, dispatch] = useReducer(todoReducer, initialTodos);

	console.log('In Render');

	todos.forEach((item, key) => {
		const { text, complete } = item;
		const include = checked ? complete : !complete;
		include &&
			todosHtml.push(
				<div key={key}>
					<span>{text}</span>
					<span onClick={() => handleDelete(key)}> Delete </span>
					<span onClick={() => handleComplete(key)}> Complete </span>
				</div>
			);
	});

	function handleSubmit(event) {
		event.preventDefault();
		if (inputTextRef.current) {
			dispatch({ type: 'TODO_ADD_NEW', payload: { value: inputTextRef.current } });
			inputTextRef.current = '';
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

	const handleShowCompleted = () => (isChecked, val) => setChecked(isChecked);

	return (
		<React.Fragment>
			<form onSubmit={handleSubmit}>
				<InputText label="Search Item:" defaultValue={searchRef.current} inputTextRef={searchRef} />
				<CombinedRefCheckbox name="Show Completed:" label="Show Completed:" callback={handleShowCompleted()} />
				<InputText label="Add Item:" defaultValue={inputTextRef.current} inputTextRef={inputTextRef} />
				<input type="submit" value="Submit" />
			</form>
			<div>All the Todos</div>
			<div>{todosHtml}</div>
		</React.Fragment>
	);
}

export default ToDos;
