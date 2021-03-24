import React, { forwardRef, useState, useEffect, useRef } from 'react';
import useCombinedRefs from '../../../hooks/useCombinedRefs';

const CombinedRefCheckbox = forwardRef(
	({ label, name, value, onChange, defaultChecked = false, ...rest }, forwardedRef) => {
		const [checked, setChecked] = useState(defaultChecked);

		const innerRef = useRef(null);
		const combinedRef = useCombinedRefs(forwardedRef, innerRef);

		const setCheckedInput = (checked) => {
			if (innerRef.current.checked !== checked) {
				// just emulate an actual click on the input element
				innerRef.current.click();
			}
		};

		useEffect(() => {
			setCheckedInput(checked);
			typeof onChange === 'function' && onChange(checked);
		}, [checked]);

		return (
			<div onClick={() => setChecked(!checked)} style={{ cursor: 'pointer' }}>
				<input
					style={{ display: 'none' }}
					ref={combinedRef}
					type="checkbox"
					name={name}
					value={value}
					defaultChecked={defaultChecked}
					onChange={(e) => {
						setChecked(e.target.checked);
					}}
				/>
				[{checked ? 'X' : ' '}]{label}
			</div>
		);
	}
);

export default CombinedRefCheckbox;
