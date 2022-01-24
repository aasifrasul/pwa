import React from 'react';

const Image = ({ src, styles, alt, lazy }) => {
	return lazy ? (
		<img data-attr-src={src} className={styles} alt={alt} loading="lazy" decoding="async" />
	) : (
		<img data-attr-src={src} className={styles} alt={alt} />
	);
};

export default Image;
