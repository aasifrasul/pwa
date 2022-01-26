import React from 'react';

const Image = ({ src, styles, alt, lazy, width = 100, height = 100 }) => {
	const img = lazy ? (
		<img
			data-src={src}
			className={styles}
			height={height}
			width={width}
			alt={alt}
			loading="lazy"
			decoding="async"
		/>
	) : (
		<img src={src} className={styles} height={height} width={width} alt={alt} />
	);

	return img;
};

export default Image;
