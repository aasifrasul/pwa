function Binding(b) {
	const self = this;
	this.elementBindings = [];
	this.value = b.object[b.property];
	this.valueGetter = () => self.value;
	this.valueSetter = function (val) {
		self.value = val;
		for (var i = 0; i < self.elementBindings.length; i++) {
			var binding = self.elementBindings[i];
			binding.element[binding.attribute] = val;
		}
	};
	this.addBinding = function (element, attribute, event) {
		var binding = {
			element,
			attribute,
		};
		if (event) {
			element.addEventListener(event, (event) => self.valueSetter(element[attribute]));
			binding.event = event;
		}
		this.elementBindings.push(binding);
		element[attribute] = self.value;
		return self;
	};

	Object.defineProperty(b.object, b.property, {
		get: this.valueGetter,
		set: this.valueSetter,
	});

	b.object[b.property] = this.value;
}

var fetchById = (id) => document.querySelector(`#${id}`);

var obj = { a: 123 };
var myInputElement1 = fetchById('myText1');
var myInputElement2 = fetchById('myText2');
var myDOMElement = fetchById('myDomElement');

var bindingInstance = new Binding({
	object: obj,
	property: 'a',
});
bindingInstance
	.addBinding(myInputElement1, 'value', 'keyup')
	.addBinding(myInputElement2, 'value', 'keyup')
	.addBinding(myDOMElement, 'innerHTML');

obj.a = 456;
