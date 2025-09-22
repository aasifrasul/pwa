function forEach(callback, thisArg) {
    // 1. Let O be the result of calling ToObject(this value).
    // This is implicitly handled by the context or will throw if this is null/undefined
    // or if the initial Array.isArray check passes.
    // However, the standard behavior allows non-arrays to be coerced.
    // For a true polyfill, you'd want something like:
    // if (this == null) throw new TypeError('this is null or not defined');
    // const O = Object(this); // The standard specifies ToObject

    if (this == null) { // Covers null and undefined
        throw new TypeError('this is null or undefined');
    }
    const O = Object(this); // Coerce to object

    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    const len = O.length >>> 0; // Ensures length is a non-negative integer

    let k = 0;
    while (k < len) {
        if (k in O) {
            callback.call(thisArg, O[k], k, O);
        }
        k++;
    }
}

if (!Array.prototype.forEach) {
    Object.defineProperty(Array.prototype, 'forEach', {
        value: forEach,
        enumerable: false,
        configurable: true,
        writable: true,
    });
}