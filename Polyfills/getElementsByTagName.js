function getElementsByTagName(tag) {
	let currentNode,
		resultSet = [];
	ni = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, function (node) {
		return node.nodeName.toLowerCase() === tag.toLowerCase() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	});

	while ((currentNode = ni.nextNode())) {
		resultSet.push(currentNode);
	}

	return resultSet;
}

getElementsByTagName('div');
