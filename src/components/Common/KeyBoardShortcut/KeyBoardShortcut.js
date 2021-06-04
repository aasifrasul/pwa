import React from 'react';
import PropTypes from 'prop-types';

import KeyBoardShortcutHelper from './KeyBoardShortcutHelper';

import withKeyBoardShortcut from '../../../HOCs/KeyBoardShortcutHOC';
import ThemeContext from '../../../Context/ThemeContext';

const helperInstance = KeyBoardShortcutHelper.getInstance();
const listener = helperInstance.getListenerInstance();

class KeyBoardShortcut extends React.Component {
	constructor(props) {
		super(props);
		this.registeredObject = null;
		this.handleSuccess = this.handleSuccess.bind(this);
	}

	componentDidMount() {
		const { combo, description } = this.props;
		this.registeredObject = listener.simple_combo(combo.toLowerCase(), () => {
			Promise.resolve().then(this.handleSuccess);
			alert(`You pressed ${combo}`);
			this.props.callback();
		});
	}

	handleSuccess() {
		this.hash = helperInstance.generateHash();
		this.props.addShortcut(this.hash, this.registeredObject, this.props.description);
	}

	componentWillUnmount() {
		this.props.removeShortcut(this.hash);
		listener.unregister_many([this.registeredObject]);
	}

	render() {
		return (
			<ThemeContext.Consumer>
				{(activeShortcuts) => {
					return <div>{JSON.stringify(activeShortcuts)}</div>;
				}}
			</ThemeContext.Consumer>
		);
	}
}

KeyBoardShortcut.defaultProps = {
	combo: '',
	callback: () => {},
	description: '',
};

KeyBoardShortcut.propTypes = {
	combo: PropTypes.string,
	callback: PropTypes.func,
	description: PropTypes.string,
};

export default KeyBoardShortcut;
