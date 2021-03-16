import React, {useState} from 'react';

import './Home.css';

import { getArrayCount } from '../../../utils/ArrayUtils';

export default (props) => {
	const [checked, setChecked] = useState('');
	const [categoresChecked, setCategoresChecked] = useState([]);
	const { data, categories } = props;
	const parent = [];
	const childHtml = [];
	const categoriesHtml = [];
	let count = 0;

	const handleCheckBoxChange = (e,id) => {
		// Handling the elemnt checked
		e.preventDefault();
		setChecked(e.target.checked ? id : '');
		console.log('checked', e.target.checked);
	}

	const handleCategories = (e,key) => {
		// Collecting all the checked categories
		e.preventDefault();
		if (e.target.checked) {
			categoresChecked.push(key);
		}
	}

	for (const key in categories) {
		categoriesHtml.push((
			<div>
				{key}
				<input type="checkbox" className="checkBox" onChange={(e) => handleCategories(e,key)} />
			</div>
		));
	}

	for (const key in data) {
		let childCount = 0;
		const { id, title, children } = data[key];

		(checked !== id) && getArrayCount(children) && children.forEach((item, key) => {
			 item && item.title && childHtml.push(<div key={item.id}>=>{++childCount}. {item.title}</div>);
		});

		parent.push(
			<React.Fragment>
				<input type="checkbox" className="checkBox" checked={checked === id} onChange={(e) => handleCheckBoxChange(e,id)} />
				<div key={id}>
					<span className="parent">{++count}. {title}</span>
					<div className="children">
						{childHtml}
					</div>
				</div>
			</React.Fragment>
		);
	}
	return (
		<React.Fragment>
			<div>
				{categoriesHtml}
			</div>
			<div className="home">
				{parent}
			</div>
		</React.Fragment>
	);
};
