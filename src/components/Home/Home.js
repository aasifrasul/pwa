import React, { useState } from 'react';

function Home() {
	const [bgColour, setBgColour] = useState('#fafafa');

	const appStyles = {
		height: '100vh',
		background: `${bgColour}`,
	};

	const styles = {
		width: '100px',
		fontSize: '20px',
		borderRadius: '40px',
		border: '1px solid black',
		color: 'white',
		margin: '0.5em 1em',
		padding: '0.25em 1em',
		background: '#17e1e9',
	};

	return (
		<div className="App" style={appStyles}>
			<div style={styles} onMouseEnter={() => setBgColour('#17e1e9')} onMouseLeave={() => setBgColour('#fafafa')}>
				{' '}
				Sand Green
			</div>
		</div>
	);
}

export default Home;
