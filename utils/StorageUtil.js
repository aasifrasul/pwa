/* eslint-disable no-console */
/**
 * StorageUtil is a small utility for caching data on the client. It supports the following
 * 2 methods of caching:
 * 1. Cache API - should use for addressable resources
 * 2. IDB API - this is a very light-weight implementation supporting only key-val pairs.
 *
 * Currently the library does auto-detect and default to the supported method for caching. This
 * however can be overridden by using the 'useStorageMethod' method of this utility.
 */

class StorageUtil {
	constructor(storage, cacheName = null) {
		this.cacheName = cacheName;
		const keys = ['localStorage', 'sessionStorage', 'caches', 'indexedDB'];
		this.supportedMethods = new Map();
		this.bail = true;
		let isSupported;

		if (typeof window !== 'undefined') {
			keys.forEach((key) => {
				isSupported = window[key] ? true : false;
				this.supportedMethods.set(key, isSupported);
				isSupported ? (this.bail = false) : null;
			});

			// bail == true, we dont support any of the storage methods
			if (!this.bail) {
				if (this.supportedMethods.get(storage)) {
					this.storage = storage;
				} else if (window.caches) {
					this.storage = StorageUtil.CACHE;
				} else if (window.indexedDB) {
					this.storage = StorageUtil.IDB;
				}
			}
		}
	}

	/**
	 * Updates the default storage mechanism with the
	 * value provided.
	 *
	 * @param {string} storage
	 * @returns {Promise}
	 *
	 */
	useStorageMethod = (storage) =>
		new Promise((resolve, reject) => {
			switch (storage) {
				case StorageUtil.CACHE:
				case StorageUtil.IDB:
				case StorageUtil.LOCALSTORAGE:
				case StorageUtil.SESSIONSTORAGE:
					this.storage = storage;
					resolve();
					return;
			}
			reject();
		});

	checkForCachename = (reject) => {
		if (this.storage === StorageUtil.CACHE && !this.cacheName) {
			reject('Invalid cache name!!');
			console.log('Warning: Invalid cache name!!');
		}
	};

	isBailoutNeeded = (reject) => {
		if (this.bail) {
			reject(StorageUtil.SUPPORT_ERROR);
			console.log('Warning: None of the storage method is supported!!');
		}
	};

	/**
	 * Sets a <key, value> pair into the cache.
	 *
	 * @param {any} key
	 * @param {any} value
	 * @returns {Promise}
	 *
	 */
	set = (key, value) =>
		new Promise((resolve, reject) => {
			this.isBailoutNeeded(reject);

			switch (this.storage) {
				case StorageUtil.CACHE:
					this.checkForCachename(reject);

					return caches
						.open(this.cacheName)
						.then((cache) => {
							return cache.put(key, value);
						})
						.then(() => {
							resolve();
						})
						.catch((e) => {
							reject(e);
						});

				case StorageUtil.IDB:
					return iDBKeyVal
						.set(key, value)
						.then(() => {
							resolve();
						})
						.catch((e) => {
							reject(e);
						});

				case StorageUtil.LOCALSTORAGE:
				case StorageUtil.SESSIONSTORAGE:
					window[this.storage].setItem(key, value);
					return resolve(true);
			}
		});

	/**
	 * Fetches a <value> for a given key from the cache.
	 *
	 * @param {any} key
	 * @returns {Promise}
	 *
	 */
	get = (key) =>
		new Promise((resolve, reject) => {
			this.isBailoutNeeded(reject);

			switch (this.storage) {
				case StorageUtil.CACHE:
					this.checkForCachename(reject);

					return caches
						.open(this.cacheName)
						.then((cache) => {
							return cache.match(key);
						})
						.then((value) => {
							resolve(value);
						})
						.catch((e) => {
							reject(e);
						});

				case StorageUtil.IDB:
					return iDBKeyVal
						.get(key)
						.then((value) => {
							resolve(value);
						})
						.catch((e) => {
							reject(e);
						});

				case StorageUtil.LOCALSTORAGE:
				case StorageUtil.SESSIONSTORAGE:
					return resolve(window[this.storage].getItem(key));
			}
		});

	/**
	 * Deletes a <key> from the cache.
	 *
	 * @param {any} key
	 * @returns {Promise}
	 *
	 */
	delete = (key) =>
		new Promise((resolve, reject) => {
			this.isBailoutNeeded(reject);

			switch (this.storage) {
				case StorageUtil.CACHE:
					this.checkForCachename(reject);

					return caches
						.open(this.cacheName)
						.then((cache) => {
							return cache.delete(key);
						})
						.then(() => {
							resolve();
						})
						.catch((e) => {
							reject(e);
						});

				case StorageUtil.IDB:
					return iDBKeyVal.delete(key);

				case StorageUtil.LOCALSTORAGE:
				case StorageUtil.SESSIONSTORAGE:
					window[this.storage].removeItem(key);
					return resolve(true);
			}
		});

	/**
	 * Returns the current selected storage method
	 * for the utility.
	 *
	 * @returns {Promise}
	 *
	 */
	getStorageMethod = () => this.storage;
}

StorageUtil.SUPPORT_ERROR = 'Caches/Idb not supported';
StorageUtil.IDB = 'IDB';
StorageUtil.CACHE = 'Cache';
StorageUtil.LOCALSTORAGE = 'localStorage';
StorageUtil.SESSIONSTORAGE = 'sessionStorage';
