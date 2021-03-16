module.exports = {
	template: require('../templates/index.hbs'),
	helper: {
		if_eq: (a, b, opt) => {
			return opt.fn({});
		},
	},
};
