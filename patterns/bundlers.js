// common code for implementing require()/exports
var dependencies = {}; // loaded modules
var modules = {}; // code of your dependencies

// require function
var require = function (module) {
	if (!dependencies[module]) {
		// module not loaded, let’s load it
		var exports = {};
		modules[module](exports);
		// now in `exports` we have the things made “public”
		dependencies[module] = exports;
	}
	return dependencies[module];
};

// dependendencies
modules['jquery'] = function (exports) {
	// code of jquery
};

modules['foo'] = function (exports) {
	// code of bar.js
	exports.helloWorld = function () {
		console.log('hello world');
	};
};

modules['bar'] = function (exports) {
	// code of bar.js
};

// etc…
// here goes the code of your "entry file".
// Which is the entry point of your code
// For example:
var $ = require('jquery');
var foo = require('foo');
var bar = require('bar');
foo.helloWorld();

// function that takes in a file path and recursively resolves dependencies
function resolveDependencies(filePath, dependencyGraph, visitedFiles) {
	// if this file has already been visited, exit
	if (visitedFiles.has(filePath)) {
		return;
	}

	// add this file to the set of visited files
	visitedFiles.add(filePath);

	// read the contents of the file
	const fileContents = readFile(filePath);

	// find any import or require statements in the file
	const dependencies = findDependencies(fileContents);

	// for each dependency, resolve it and add it to the graph
	dependencies.forEach((dependencyPath) => {
		const absolutePath = resolvePath(dependencyPath, filePath);
		dependencyGraph.addDependency(filePath, absolutePath);
		resolveDependencies(absolutePath, dependencyGraph, visitedFiles);
	});
}

// DependencyGraph class
class DependencyGraph {
	constructor() {
		this.graph = new Map();
	}

	addDependency(parent, child) {
		if (!this.graph.has(parent)) {
			this.graph.set(parent, new Set());
		}
		this.graph.get(parent).add(child);
	}

	getDependencies(file) {
		return this.graph.get(file) || new Set();
	}

	getAllDependencies(file, visited = new Set()) {
		visited.add(file);
		const dependencies = Array.from(this.getDependencies(file));
		const childDependencies = dependencies.flatMap((child) => {
			if (!visited.has(child)) {
				return this.getAllDependencies(child, visited);
			}
			return [];
		});
		return new Set([...dependencies, ...childDependencies]);
	}
}

// function that finds dependencies in a file
function findDependencies(fileContents) {
	const dependencies = new Set();
	const importRegex = /import\s*['"]([^'"]+)['"]/g;
	const requireRegex = /require\s*\(['"]([^'"]+)['"]\)/g;

	// find import statements
	let match;
	while ((match = importRegex.exec(fileContents))) {
		dependencies.add(match[1]);
	}

	// find require statements
	while ((match = requireRegex.exec(fileContents))) {
		dependencies.add(match[1]);
	}

	return dependencies;
}


// entry point for the bundler
function bundle(entryPoint) {
	// initialize an empty dependency graph
	const dependencyGraph = new DependencyGraph();

	// resolve all dependencies of the entry point
	resolveDependencies(entryPoint, dependencyGraph, new Set());

	// generate the bundled output
	const output = generateOutput(dependencyGraph);

	// write the output to a file
	writeFile(outputPath, output);
}
