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
		alert('toggleGreen Invoked');
	};

	componentWillUnmount() {}

	render() {
		return (
			<ThemeContext.Provider value={this.props.fetchActiveShortcuts()}>
				<KeyBoardShortcut
					combo="shift s"
					callback={this.toggleGreen}
					description="Turns the Background color of the Component to yellow"
				/>
			</ThemeContext.Provider>
		);
	}
}

ImplementKeyBoardShortcut.defaultProps = {
	combo: '',
	callback: () => {},
	description: '',
};

ImplementKeyBoardShortcut.propTypes = {
	combo: PropTypes.string,
	callback: PropTypes.func,
	description: PropTypes.string,
};

export default withKeyBoardShortcut(ImplementKeyBoardShortcut);
