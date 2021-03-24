import React, { useState, useEffect } from 'react';

const InputText = (props) => {
	const { label, name, callback, defaultValue = '' } = props;
	const [value, setValue] = useState(defaultValue);
	useEffect(() => setValue(defaultValue), [defaultValue]);
	const handleChange = (e) => {
		e.preventDefault();
		setValue(e.target.value);
		typeof callback === 'function' && callback(e.target.value);
	};

	return (
		<label>
			{label}
			<input type="text" label={label} name={name} value={value} onChange={handleChange} />
		</label>
	);
};

export default InputText;
