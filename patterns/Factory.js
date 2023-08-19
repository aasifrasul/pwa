// Dealer A
const DealerA = {
	title() {
		return 'Dealer A';
	},
	pay(amount) {
		console.log(`Set up configuration using username: ${this.username} and password: ${this.password}`);
		return `Payment for service ${amount} is successful using ${this.title()}`;
	},
};

// Dealer B
const DealerB = {
	title() {
		return 'Dealer B';
	},
	pay(amount) {
		console.log(`Set up configuration using username: ${this.username} and password: ${this.password}`);
		return `Payment for service ${amount} is successful using ${this.title()}`;
	},
};

function DealerFactory(DealerOption, config = {}) {
	const dealer = Object.create(DealerOption);
	Object.assign(dealer, config);
	return dealer;
}

const dealerFactoryA = DealerFactory(DealerA, {
	username: 'user',
	password: 'pass',
});
console.log(dealerFactoryA.title());
console.log(dealerFactoryA.pay(12));

const dealerFactoryB = DealerFactory(DealerB, {
	username: 'user2',
	password: 'pass2',
});
console.log(dealerFactoryB.title());
console.log(dealerFactoryB.pay(50));
