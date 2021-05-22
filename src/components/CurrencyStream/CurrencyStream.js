import React, { useEffect, useState } from 'react';

import GridData from '../Common/GridData/GridData';
import OSStatistics from '../Common/OSStatistics/OSStatistics';

import SPQueue from '../../utils/SPQueue';

function CurrencyStream(props) {
	return (
		<div>
			<OSStatistics />
			<GridData queue={new SPQueue()} />
		</div>
	);
}

export default CurrencyStream;
