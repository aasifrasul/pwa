import React, { useState, useEffect } from 'react';

import Checkbox from '../Common/Checkbox';

import { getArrayCount, alphabets } from '../../utils/ArrayUtils';

import './Home.css';

export default (props) => {
	const { data, categories } = props;
	const [selectedParents, setSelectedParents] = useState(new Map());
	const [categoriesChecked, setCategoresChecked] = useState(new Map());
	const [filteredData, setFilteredData] = useState(data);
	useEffect(() => {
		setCategoresChecked(categoriesChecked);
	}, [categoriesChecked]);
	const parent = [];
	let childHtml = [];
	const categoriesHtml = [];
	let count = 0;

	const handleParentSelection = (checked, value) => {
		// Handling the elemnt checked
		console.log('checked, value', checked, value);
		checked ? selectedParents.set(value, true) : selectedParents.delete(value);
		setSelectedParents(new Map(selectedParents));
	};

	const handleCategoriesSelection = (checked, value) => {
		// Collecting all the checked categories
		checked ? categoriesChecked.set(value, true) : categoriesChecked.delete(value);
		setCategoresChecked(new Map(categoriesChecked));
		handleFilteredData(categoriesChecked);
	};

	const handleFilteredData = (parentCategoresChecked) => {
		let hash = Object.create(null);
		let item = null;

		if (parentCategoresChecked.size) {
			for (let key in data) {
				item = data[key];
				if (parentCategoresChecked.has(item.category)) {
					hash[key] = item;
				}
			}
		} else {
			hash = Object.assign({}, data);
		}
		setFilteredData(hash);
	};

	for (const key in categories) {
		categoriesHtml.push(
			<div key={key}>
				<Checkbox label={key} name={key} value={key} callback={handleCategoriesSelection} />
			</div>
		);
	}

	for (let key in filteredData) {
		let childCount = 0;
		const { id, title, children } = filteredData[key];
		childHtml = [];
		key = <span>{key + (selectedParents.has(key) ? ' Children Hidden' : '')}</span>;

		!selectedParents.has(id) &&
			getArrayCount(children) &&
			children.forEach((item, key) => {
				item &&
					item.title &&
					childHtml.push(
						<div key={item.id}>
							{alphabets[childCount++]}. {item.title}
						</div>
					);
			});

		parent.push(
			<div key={id}>
				<Checkbox label={key} name={id} value={id} callback={handleParentSelection} />
				<div>
					<span className="parent">
						{++count}. {title}
					</span>
					<div className="children">{childHtml}</div>
				</div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<div>{categoriesHtml}</div>
			<div className="home">{parent}</div>
		</React.Fragment>
	);
};
