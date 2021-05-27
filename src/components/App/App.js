import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import regeneratorRuntime from 'regenerator-runtime';

const Home = lazy(() => import(/* webpackChunkName: "Home" */ '../Home/Home'));
const Profile = lazy(() => import(/* webpackChunkName: "Profile" */ '../Profile/Profile'));
const Todos = lazy(() => import(/* webpackChunkName: "Todos" */ '../Todos/Todos'));
const NestedCategories = lazy(() =>
	import(/* webpackChunkName: "NestedCategories" */ '../NestedCategories/NestedCategories')
);
const Stopwatch = lazy(() => import(/* webpackChunkName: "Stopwatch" */ '../Stopwatch/Stopwatch'));
const CurrencyStream = lazy(() => import(/* webpackChunkName: "CurrencyStream" */ '../CurrencyStream/CurrencyStream'));
const MovieList = lazy(() => import(/* webpackChunkName: "MovieList" */ '../MovieList/MovieList'));
const TicTacToe = lazy(() => import(/* webpackChunkName: "TicTacToe" */ '../TicTacToe/TicTacToe'));
import ErrorBoundary from '../Common/ErrorBoundary/ErrorBoundary';

function App(props) {
	return (
		<Suspense fallback={<h1>Loading App...</h1>}>
			<ErrorBoundary>
				<Router>
					<Switch>
						<Route exact path="/" component={() => <Home />} />
						<Route exact path="/TicTacToe" component={() => <TicTacToe />} />
						<Route exact path="/Profile" component={() => <Profile />} />
						<Route exact path="/NestedCategories" component={() => <NestedCategories />} />
						<Route exact path="/Todos" component={() => <Todos />} />
						<Route exact path="/Stopwatch" component={() => <Stopwatch />} />
						<Route exact path="/CurrencyStream" component={() => <CurrencyStream />} />
						<Route exact path="/MovieList" component={() => <MovieList />} />
					</Switch>
				</Router>
			</ErrorBoundary>
		</Suspense>
	);
}

export default App;
