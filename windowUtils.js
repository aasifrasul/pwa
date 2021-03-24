export const safeWindow = (callback) => {
	return typeof window !== 'undefined' && typeof callback === 'function' && callback();
};

export const safeRIC = (callback) => {
	return safeWindow(() => {
		return (typeof window.requestIdleCallback === 'function' && window.requestIdleCallback(callback)) || callback();
	});
};

export const safeRAF = (callback) => {
	return safeWindow(() => {
		return (
			(typeof window.requestAnimationFrame === 'function' && window.requestAnimationFrame(callback)) || callback()
		);
	});
};

export const isCookieDisabled = () => {
	// Window will not be available while building hbs.
	if (typeof window === 'undefined') {
		return false;
	}
	return !navigator.cookieEnabled;
};
