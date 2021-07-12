import React, { useState, useMemo } from 'react';

import { useDraggable } from '../../hooks/useDraggable';

const Home = () => {
	const [[x, y], setCords] = useState([0, 0]);
	const style = useMemo(
		() => ({
			position: 'absolute',
			top: `${y}px`,
			left: `${x}px`,
		}),
		[x, y]
	);
	const [ref, onMouseDown] = useDraggable(setCords);

	return (
		<div ref={ref} onMouseDown={onMouseDown} style={style}>
			Start Dragging!
		</div>
	);
};

export default Home;
