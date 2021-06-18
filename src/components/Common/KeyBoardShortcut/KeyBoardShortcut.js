import React, { useState, useEffect, useRef } from 'react';

import KeyBoardShortcutHelper from './KeyBoardShortcutHelper';
import withKeyBoardShortcut from '../../../HOCs/KeyBoardShortcutHOC';

import { useKeyBoardShortcutDispatch } from '../../../Context/KeyBoardShortcutContext';

const helperInstance = KeyBoardShortcutHelper.getInstance();
const listener = helperInstance.getListenerInstance();

function KeyBoardShortcut(props) {
	const didMount = useRef(false);
	const { combo, description } = props;
	const [registeredObject, setRegisteredObject] = useState({});
	const [hash, setHash] = useState(null);
	const dispatch = useKeyBoardShortcutDispatch();

	const handleSuccess = () => {
		const hash1 = helperInstance.generateHash();
		setHash(hash1);
		props.addShortcut(hash1, registeredObject, description);
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
			hash && props.removeShortcut(hash);
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

export default withKeyBoardShortcut(KeyBoardShortcut);
