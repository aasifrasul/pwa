import React, { useEffect, useState } from 'react';
import useToggle from './useToggle';

// Hook that alerts clicks outside of the passed ref
const useOutsideClick = (ref: any) => {
	const { active: outsideClicked, toggle: setOutsideClicked } = useToggle();
	const handleClickOutside = (event: any) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setOutsideClicked();
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [ref]);

	return outsideClicked;
};

export default useOutsideClick;
