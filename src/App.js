import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import idx from 'idx';
import regeneratorRuntime from 'regenerator-runtime';

import Home from './Components/Home/Home';
import Todos from './Components/todos/todos';
import Stopwatch from './Components/stopwatch/stopwatch';
import CurrencyStream from './Components/CurrencyStream/CurrencyStream';
import ErrorBoundary from './components/Common/ErrorBoundary/ErrorBoundary';

import useFetch from './hooks/useFetch';

import { getArrayCount, buildNestedWithParentId } from '../utils/ArrayUtils';

function App(props) {
	const [categories, setCategories] = useState(Object.create(null));
	const [nestedData, setNestedData] = useState(Object.create(null));

	const { data, isError, isLoading } = useFetch(
		'https://okrcentral.github.io/sample-okrs/db.json',
		Object.create(null),
		successCallback,
		failureCallback
	);

	function failureCallback(res) {}

	function successCallback(res) {
		if (!isLoading && !isError && idx(res, (_) => _.data)) {
			const { nestedStructure, categories } = buildNestedWithParentId(res.data);
			setNestedData(nestedStructure);
			setCategories(categories);
		}
	}

	/*
	useEffect(() => {
		axios
			.get('https://okrcentral.github.io/sample-okrs/db.json')
			.then((res) => {
				const { status, data } = res;
				if (status === 200 && getArrayCount(data.data)) {
					const { nestedStructure, categories } = buildNestedWithParentId(data.data);
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
*/

	return (
		<ErrorBoundary>
			<Router>
				<Switch>
					<Route exact path="/" component={() => <Home data={nestedData} categories={categories} />} />
					<Route exact path="/todos" component={() => <Todos />} />
					<Route exact path="/stopwatch" component={() => <Stopwatch />} />
					<Route exact path="/currencyStream" component={() => <CurrencyStream />} />
				</Switch>
			</Router>
		</ErrorBoundary>
	);
}

export default App;
