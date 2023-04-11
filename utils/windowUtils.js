const dataType = (data) => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

const isFunction = (data) => dataType(data) === 'function';
const isUndefined = (data) => dataType(data) === 'undefined';

export const safeWindow = (callback) => {
	return isFunction(callback) && callback();
};

export const safeRIC = (callback) => {
	return safeWindow(() => {
		return (isFunction(window.requestIdleCallback) && window.requestIdleCallback(callback)) || callback();
	});
};

export const safeRAF = (callback) => {
	return safeWindow(() => {
		return (isFunction(window.requestAnimationFrame) && window.requestAnimationFrame(callback)) || callback();
	});
};

export const isCookieDisabled = () => {
	// Window will not be available while building hbs.
	if (isUndefined(window)) {
		return false;
	}
	return !navigator.cookieEnabled;
};
