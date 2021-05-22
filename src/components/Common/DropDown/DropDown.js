import React, { useEffect, useState } from 'react';

export default function DropDown(props) {
	const { options, selectHandler, title } = props;
	const [selected, setSelected] = useState();
	const handleChange = () => (e) => {
		let { selectedIndex } = e.target;
		console.log(selectedIndex);
		const item = selectedIndex ? options[--selectedIndex] : null;
		setSelected((item || {}).title);
		selectHandler(item);
	};
	const optionsHtml = options.map(({id, title}) => <option key={title} value={title}>{title}</option>);
	optionsHtml.unshift(<option key={0}>{title}</option>);
	return (
		<div>
			<select value={selected} defaultValue={selected} onChange={handleChange()}>{optionsHtml}</select>
		</div>
	);
}
