if (!JSON.stringify) {
	JSON.stringify = function (value, replacer, space) {
		if (typeof value === 'string') {
			return '"' + value + '"';
		} else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
			return String(value);
		} else if (Array.isArray(value)) {
			var result = [];
			for (var i = 0; i < value.length; i++) {
				result.push(JSON.stringify(value[i], replacer, space));
			}
			return '[' + result.join(',') + ']';
		} else if (typeof value === 'object') {
			var result = [];
			for (var key in value) {
				if (value.hasOwnProperty(key)) {
					if (replacer) {
						var replacement = replacer(key, value[key]);
						if (replacement !== undefined) {
							result.push('"' + key + '":' + JSON.stringify(replacement, replacer, space));
						}
					} else {
						result.push('"' + key + '":' + JSON.stringify(value[key], replacer, space));
					}
				}
			}
			if (space) {
				return '{\n' + result.join(',\n') + '\n' + Array(space + 1).join(' ') + '}';
			} else {
				return '{' + result.join(',') + '}';
			}
		}
	};
}
