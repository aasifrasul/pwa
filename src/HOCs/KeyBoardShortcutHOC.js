import React from 'react';
import PropTypes from 'prop-types';

//const activeShortcuts = Object.create(null);

const withKeyBoardShortcut = (WrappedComponent) => {
	class Wrapper extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				activeShortcuts: {},
			};
		}

		fetchActiveShortcuts = () => {
			return this.state.activeShortcuts;
		};
		addShortcut = (hash, obj, desc) => {
			this.setState(({ activeShortcuts }) => {
				activeShortcuts[hash] = {
					obj,
					desc,
				};
				return activeShortcuts;
			});
		};
		removeShortcut = (hash) => {
			this.setState(({ activeShortcuts }) => {
				delete activeShortcuts[hash];
				return activeShortcuts;
			});
		};
		render() {
			// ... and renders the wrapped component with the fresh data!
			return (
				<WrappedComponent
					{...this.props}
					fetchActiveShortcuts={this.fetchActiveShortcuts}
					addShortcut={this.addShortcut}
					removeShortcut={this.removeShortcut}
				/>
			);
		}
	}

	Wrapper.contextTypes = {};

	return Wrapper;
};

export default withKeyBoardShortcut;
