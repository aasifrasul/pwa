(function () {
	const loadedScripts = {};

	// Script loader utility
	window.ScriptLoader = {
		// Cache for loaded scripts to prevent duplicates

		// Load a single script with Promise support
		load: function (src, options = {}) {
			// Return cached promise if this script is already loading/loaded
			if (src in loadedScripts) return loadedScripts[src];

			// Default options
			const config = Object.assign(
				{
					async: true,
					defer: false,
					crossOrigin: 'anonymous',
					type: 'text/javascript',
				},
				options,
			);

			// Create promise for script loading
			const promise = new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.src = src;
				script.async = config.async;
				if (config.defer) script.defer = true;
				script.crossOrigin = config.crossOrigin;
				script.type = config.type;

				// Success handler
				script.onload = () => {
					console.log('Script loaded:', src);
					resolve(script);
				};

				// Error handler
				script.onerror = (error) => {
					console.error('Script failed to load:', src, error);
					reject(new Error(`Failed to load script: ${src}`));
				};

				// Append script to document
				document.head.appendChild(script);
			});

			// Cache the promise
			loadedScripts[src] = promise;
			return promise;
		},

		// Load multiple scripts in sequence
		loadSequential: async function (scriptSources, options = {}) {
			for (const src of scriptSources) {
				await this.load(src, options);
			}
			return true;
		},

		// Load multiple scripts in parallel
		loadParallel: function (scriptSources, options = {}) {
			return Promise.all(scriptSources.map((src) => this.load(src, options)));
		},

		// Create a Web Worker
		createWorker: function (scriptSrc) {
			try {
				const worker = new Worker(scriptSrc);
				console.log('Worker created:', scriptSrc);
				return worker;
			} catch (error) {
				console.error('Failed to create worker:', scriptSrc, error);
				throw error;
			}
		},
	};

	// Auto-initialization when DOM is ready
	document.addEventListener('DOMContentLoaded', () => {
		// Look for script tags with data-loader attributes
		const autoloadScripts = document.querySelectorAll('script[data-loader]');
		autoloadScripts.forEach((scriptTag) => {
			const src = scriptTag.getAttribute('data-src');
			const async = scriptTag.hasAttribute('data-async');
			const defer = scriptTag.hasAttribute('data-defer');

			if (src) {
				window.ScriptLoader.load(src, { async, defer });
			}
		});
	});
})();
