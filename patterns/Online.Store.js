function Product(name, price, description) {
	this.name = name;
	this.price = price;
	this.description = description;
}

const product1 = new Product('Laptop', 1000, 'A high-performance laptop');
const product2 = new Product('Headphones', 150, 'Noise-canceling headphones');

const ShoppingCart = (function () {
	const items = [];

	function addItem(product, quantity) {
		items.push({ product, quantity });
	}

	function removeItem(product) {
		const index = items.findIndex((item) => item.product === product);
		if (index > -1) {
			items.splice(index, 1);
		}
	}

	function getItems() {
		return items;
	}

	return {
		addItem,
		removeItem,
		getItems,
	};
})();

ShoppingCart.addItem(product1, 1);
ShoppingCart.addItem(product2, 2);

const PaymentProcessor = (function () {
	let instance;

	function createInstance() {
		return {
			processPayment: function (paymentDetails) {
				console.log('Processing payment:', paymentDetails);
			},
		};
	}

	return {
		getInstance: function () {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		},
	};
})();

const paymentProcessor = PaymentProcessor.getInstance();

function UserFactory() {}

UserFactory.prototype.createUser = function (type, userDetails) {
	let user;

	if (type === 'regular') {
		user = new RegularUser(userDetails);
	} else if (type === 'premium') {
		user = new PremiumUser(userDetails);
	} else if (type === 'admin') {
		user = new AdminUser(userDetails);
	} else {
		throw new Error('Invalid user type');
	}

	return user;
};

const userFactory = new UserFactory();
const regularUser = userFactory.createUser('regular', { name: 'John Doe' });

function OrderTracker() {
	this.observers = new Observer();
}

OrderTracker.prototype.placeOrder = function (orderDetails) {
	this.observers.notifyAll(orderDetails);
};

const orderTracker = new OrderTracker();

function updateInventory(orderDetails) {
	console.log('Updating inventory for order:', orderDetails);
}

function sendNotification(orderDetails) {
	console.log('Sending order notification:', orderDetails);
}

function createInvoice(orderDetails) {
	console.log('Creating invoice for order:', orderDetails);
}

orderTracker.observers.subscribe(updateInventory);
orderTracker.observers.subscribe(sendNotification);
orderTracker.observers.subscribe(createInvoice);

const userActions = {
	browseProducts: function (products) {
		console.log('Browsing products:', products);
	},
	addToCart: function (product, quantity) {
		ShoppingCart.addItem(product, quantity);
		console.log(`Added ${quantity} ${product.name} to cart`);
	},
	processPayment: function (paymentDetails) {
		paymentProcessor.processPayment(paymentDetails);
	},
};

function executeAction(action, ...args) {
	action(...args);
}

executeAction(userActions.browseProducts, [product1, product2]);
executeAction(userActions.addToCart, product1, 1);
executeAction(userActions.processPayment, { amount: 1000, method: 'Credit Card' });

Product.prototype.getDiscountedPrice = function (discount) {
	return this.price - this.price * discount;
};

const discountedProduct = Object.create(product1);
discountedProduct.discount = 0.1;

console.log(
	`Discounted price: ${discountedProduct.getDiscountedPrice(discountedProduct.discount)}`
);
