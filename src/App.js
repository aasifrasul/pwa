import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Home from './Components/Home/Home';

import { getArrayCount, buildNestedWithParentId } from '../utils/ArrayUtils';

function App(props) {
	const [categories, setCategories] = useState();
	const [nestedData, setNestedData] = useState();

	useEffect(() => {
		axios
			.get('https://okrcentral.github.io/sample-okrs/db.json')
			.then((res) => {
				const { status, data } = res;
				if (status === 200 && getArrayCount(data.data)) {
					const {nestedStructure, categories} = buildNestedWithParentId(data.data);
					setNestedData(nestedStructure);
					setCategories(categories);
				} else {
					console.log('API failure =>', res);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}, []);

	return (
		<React.Fragment>
			<Router basename="/rv/ally-test">
				<Switch>
					<Route exact path="/" component={() => <Home data={nestedData} categories={categories} />} />
				</Switch>
			</Router>
		</React.Fragment>
	);
}

export default App;
