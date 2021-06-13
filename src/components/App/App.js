import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import regeneratorRuntime from 'regenerator-runtime';

import { KeyBoardShortcutProvider } from '../../Context/KeyBoardShortcutContext';

const Home = lazy(() => import(/* webpackChunkName: "Home" */ '../Home/Home'));
const ReactQuery = lazy(() => import(/* webpackChunkName: "ReactQuery" */ '../ReactQuery/ReactQuery'));
const ImplementKeyBoardShortcut = lazy(() =>
	import(/* webpackChunkName: "ImplementKeyBoardShortcut" */ '../ImplementKeyBoardShortcut/ImplementKeyBoardShortcut')
);
const WineConnoisseur = lazy(() =>
	import(/* webpackChunkName: "WineConnoisseur" */ '../WineConnoisseur/WineConnoisseur')
);
const Profile = lazy(() => import(/* webpackChunkName: "Profile" */ '../Profile/Profile'));
const Todos = lazy(() => import(/* webpackChunkName: "Todos" */ '../todos/todos'));
const NestedCategories = lazy(() =>
	import(/* webpackChunkName: "NestedCategories" */ '../NestedCategories/NestedCategories')
);
const Stopwatch = lazy(() => import(/* webpackChunkName: "Stopwatch" */ '../stopwatch/stopwatch'));
const CurrencyStream = lazy(() => import(/* webpackChunkName: "CurrencyStream" */ '../CurrencyStream/CurrencyStream'));
const MovieList = lazy(() => import(/* webpackChunkName: "MovieList" */ '../MovieList/MovieList'));
const TicTacToe = lazy(() => import(/* webpackChunkName: "TicTacToe" */ '../TicTacToe/TicTacToe'));
const Modal = lazy(() => import(/* webpackChunkName: "Modal" */ '../Common/Modal/Modal'));

import ErrorBoundary from '../Common/ErrorBoundary/ErrorBoundary';

import styles from './App.css';

function App(props) {
	const [showModal, setShowModal] = useState(false);

	const modal = showModal ? (
		<Modal>
			<div className={styles.modal}>
				<div className={styles['modal-content']}>
					With a portal, we can render content into a different part of the DOM, as if it were any other React
					child.
				</div>
				This is being rendered inside the #modal-container div.
				<button className={styles.close} onClick={handleHide}>
					Hide modal
				</button>
			</div>
		</Modal>
	) : null;

	const handleShow = () => setShowModal(true);
	const handleHide = () => setShowModal(false);

	return (
		<Suspense fallback={<h1>Loading App...</h1>}>
			<ErrorBoundary>
				<Router>
					<Switch>
						<Route exact path="/" component={() => <Home handleShow={handleShow} />} />
						<Route exact path="/TicTacToe" component={() => <TicTacToe />} />
						<Route exact path="/ReactQuery" component={() => <ReactQuery />} />
						<Route
							exact
							path="/ImplementKeyBoardShortcut"
							component={() => (
								<KeyBoardShortcutProvider>
									<ImplementKeyBoardShortcut />
								</KeyBoardShortcutProvider>
							)}
						/>
						<Route exact path="/WineConnoisseur" component={() => <WineConnoisseur />} />
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
