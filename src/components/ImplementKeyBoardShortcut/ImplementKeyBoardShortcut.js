import React from 'react';
import PropTypes from 'prop-types';

import KeyBoardShortcut from '../Common/KeyBoardShortcut/KeyBoardShortcut';

import withKeyBoardShortcut from '../../HOCs/KeyBoardShortcutHOC';
import ThemeContext from '../../Context/ThemeContext';

class ImplementKeyBoardShortcut extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	toggleGreen = () => {
		document.body.style.backgroundColor = document.body.style.backgroundColor === 'green' ? '' : 'green';
		alert('toggleGreen Invoked');
	};

	componentWillUnmount() {}

	render() {
		return (
			<ThemeContext.Provider value={this.props.fetchActiveShortcuts()}>
				<KeyBoardShortcut
					combo="shift s"
					callback={this.toggleGreen}
					description="Turns the Background color of the Component to green"
					addShortcut={this.props.addShortcut}
					removeShortcut={this.props.removeShortcut}
				/>
			</ThemeContext.Provider>
		);
	}
}

export default withKeyBoardShortcut(ImplementKeyBoardShortcut);
