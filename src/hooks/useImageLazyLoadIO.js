import React, { useCallback, useRef, useEffect } from 'react';

export const useImageLazyLoadIO = (imgSelector, items) => {
	const imageObserver = useCallback((node) => {
		const intObs = new IntersectionObserver((entries) => {
			entries.forEach((en) => {
				if (en.intersectionRatio > 0) {
					const currentImg = en.target;
					const newImgSrc = currentImg.dataset.src;
					currentImg.removeAttribute('data-src');
					// only swap out the image source if the new url exists
					if (!newImgSrc) {
						console.error('Image source is invalid');
					} else {
						currentImg.src = newImgSrc;
					}
					intObs.unobserve(node); // detach the observer when done
				}
			});
		});
		intObs.observe(node);
	}, []);

	const imagesRef = useRef(null);

	useEffect(() => {
		imagesRef.current = document.querySelectorAll(imgSelector);
		imagesRef.current && imagesRef.current.forEach((img) => imageObserver(img));

		return () => {
			imagesRef.current = null;
		};
	}, [imageObserver, imagesRef, imgSelector, items]);
};

export default useImageLazyLoadIO;
