import React, { forwardRef, useState, useEffect } from 'react';

const Checkbox = forwardRef(({ label, name, value, onChange, defaultChecked, ...rest }, forwardedRef) => {
	const [checked, setChecked] = useState(defaultChecked);

	useEffect(() => typeof onChange === 'function' && onChange(checked), [checked]);

	return (
		<div onClick={() => setChecked(!checked)} style={{ cursor: 'pointer' }}>
			<input
				style={{ display: 'none' }}
				ref={forwardedRef}
				type="checkbox"
				name={name}
				value={value}
				checked={checked}
				onChange={(e) => {
					setChecked(e.target.checked);
				}}
			/>
			[{checked ? 'X' : ' '}]{label}
		</div>
	);
});

export default Checkbox;
