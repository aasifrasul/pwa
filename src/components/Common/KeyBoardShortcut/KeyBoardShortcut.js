import React, { useState, useEffect, useRef } from 'react';

import KeyBoardShortcutHelper from './KeyBoardShortcutHelper';

const helperInstance = KeyBoardShortcutHelper.getInstance();
const listener = helperInstance.getListenerInstance();

function KeyBoardShortcut(props) {
	const didMount = useRef(false);
	const { combo, description, dispatch } = props;
	const [registeredObject, setRegisteredObject] = useState(null);
	const [hash, setHash] = useState(null);

	const addShortcut = (hash, obj, desc) => {
		dispatch({ type: 'ADD_SHORTCUT', payload: { hash, obj, desc } });
	};
	const removeShortcut = (hash) => {
		dispatch({ type: 'REMOVE_SHORTCUT', payload: { hash } });
	};

	const handleSuccess = () => {
		const hash1 = helperInstance.generateHash();
		setHash(hash1);
		addShortcut(hash1, registeredObject, description);
	};

	useEffect(() => {
		if (!didMount.current) {
			const regObject = listener.simple_combo(combo.toLowerCase(), () => {
				alert(`You pressed ${combo}`);
				handleSuccess();
				props.callback();
			});

			setRegisteredObject(regObject);
			didMount.current = true;
		}

		return () => {
			hash && removeShortcut(hash);
			listener.unregister_many([registeredObject]);
		};
	}, [registeredObject, hash]);

	return (
		<>
			<div>Name: {combo}</div>
			<div>Description: {description}</div>
		</>
	);
}

export default KeyBoardShortcut;
