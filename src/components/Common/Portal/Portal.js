import Raect from 'react';
import ReactDOM from 'react-dom';

export default function Portal(props) {
	const { container, children } = props;
	const root = document.createElement('div');
	container.appendChild(root);

	return ReactDOM.createPortal(children, root);
}
