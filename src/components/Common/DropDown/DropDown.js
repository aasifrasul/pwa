import React, { useEffect, useState } from 'react';

export default function DropDown(props) {
	const { options, selectHandler, title, children } = props;
	const [selected, setSelected] = useState();
	const handleChange = () => (e) => {
		const { selectedIndex } = e.target;
		const item = selectedIndex ? options[selectedIndex - 1] : null;
		setSelected((item || {}).title);
		selectHandler(item);
	};
	const optionsHtml = options.map(({ id, title }) => (
		<option key={title} value={title}>
			{title} {children}
		</option>
	));
	optionsHtml.unshift(<option key={0}>{title}</option>);
	return (
		<div>
			<select value={selected} defaultValue={selected} onChange={handleChange()}>
				{optionsHtml}
			</select>
		</div>
	);
}
