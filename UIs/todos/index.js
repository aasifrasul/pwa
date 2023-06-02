(function () {
	//const items = ['apple', 'grapes', 'guava', 'mango', 'banana'];
	const items = Array.from(Array(30).keys()).map((i) => ({ name: `Item ${++i}` }));
	//const items = Array.apply(null, { length: 100000 }).map(Number.call, Number).map(i => `Text ${i}`);
	let list,
		app,
		loader,
		filter = 'All',
		showUndoDelete = false,
		currentPageItems,
		pageNum = 1;
	const pageSize = 10;

	window.addEventListener('DOMContentLoaded', function () {
		list = document.querySelector('#list');
		app = document.querySelector('#app');
		loader = document.querySelector('#loaders');
		fromContainer = document.querySelector('#fromContainer');
		loader.replaceChildren();
		addCompletedOption();
		currentPageItems = items.slice(0, pageSize);
		displayList(currentPageItems);
		const inputElement = displayInputElelment();
		displaySubmitButton(inputElement);
		addSeparator(app);
		displayPagination();
		addSeparator(app);
		buildForm();
	});

	function addCompletedOption() {
		const fieldset = document.createElement('fieldset');
		fieldset.setAttribute('type', 'checkbox');
		fieldset.id = 'complete';

		['All', 'Completed', 'Uncompleted', 'Deleted'].forEach((i) => {
			const radio = document.createElement('input');
			radio.setAttribute('type', 'radio');
			radio.name = fieldset.id;
			radio.value = i;
			filter === i && (radio.checked = true);
			fieldset.appendChild(radio);
			fieldset.appendChild(document.createTextNode(i));
			radio.onclick = function () {
				filter = radio.value;
				displayList(currentPageItems);
			};
		});

		loader.appendChild(fieldset);
	}

	function displayList(listItems) {
		const startTime = performance.now();
		let fragment = document.createDocumentFragment();
		list.replaceChildren();
		listItems.forEach(({ isDeleted, isCompleted }, index) => {
			let shouldShow = !isDeleted;
			if (filter === 'Completed') {
				shouldShow &&= isCompleted;
			} else if (filter === 'Uncompleted') {
				shouldShow &&= !isCompleted;
			} else if (filter === 'Deleted') {
				shouldShow = isDeleted;
			}

			if (shouldShow) {
				const elem = document.createElement('li');
				elem.setAttribute('id', `key-${index}`);
				elem.appendChild(createConditionalStrikedElement(index));
				elem.appendChild(addDeleteButton(index));
				elem.appendChild(addCompleteCheckBox(index));
				fragment.appendChild(elem);
			}

			if (!showUndoDelete && isDeleted) {
				showUndoDelete = true;
			}
		});

		list.appendChild(fragment);
		console.log('Time taken:', performance.now() - startTime);
	}

	function createConditionalStrikedElement(index) {
		const item = currentPageItems[index];
		const span = document.createElement('span');
		const textNode = document.createTextNode(item.name);
		if (item.isCompleted) {
			const strike = document.createElement('strike');
			strike.appendChild(textNode);
			span.appendChild(strike);
		} else {
			span.appendChild(textNode);
		}

		return span;
	}

	function addCompleteCheckBox(index) {
		const checkBox = document.createElement('input');
		checkBox.setAttribute('type', 'checkBox');
		checkBox.checked = !!currentPageItems[index].isCompleted;
		checkBox.onclick = function () {
			currentPageItems[index].isCompleted = !!checkBox.checked;
			displayList(currentPageItems);
		};
		return checkBox;
	}

	function displayInputElelment() {
		const inputElem = document.createElement('input');
		inputElem.setAttribute('type', 'text');
		inputElem.setAttribute('defaultValue', 'Add Item');
		inputElem.classList.add('addItem');
		app.appendChild(inputElem);
		return inputElem;
	}

	function displaySubmitButton(inputElem) {
		const button = document.createElement('button');
		button.appendChild(document.createTextNode('Add Item'));
		app.appendChild(button);
		button.onclick = function () {
			addItem(inputElem);
		};
	}

	function addItem(inputElem) {
		const regex = /^[a-zA-Z0-9 ]{2,30}$/;
		const isValid = regex.test(inputElem.value);
		if (isValid) {
			currentPageItems.push({ name: inputElem.value });
			inputElem.value = '';
			displayList(currentPageItems);
		}
	}

	function addDeleteButton(index) {
		const elem = document.createElement('span');
		const item = currentPageItems[index];
		!item.isDeleted && elem.classList.add('red');
		elem.appendChild(document.createTextNode(' X '));
		elem.onclick = function () {
			removeElement(index);
		};
		return elem;
	}

	function removeItemByIndex(index) {
		console.log('index', index);
		currentPageItems.splice(index, 1);
		displayList(currentPageItems);
	}

	function removeElement(index) {
		currentPageItems[index].isDeleted = !currentPageItems[index].isDeleted;
		displayList(currentPageItems);
	}

	function buildForm() {
		const form = document.createElement('form');
		form.id = 'form';
		fromContainer.appendChild(form);
		form.onsubmit = function (e) {
			console.log('Submit');
			e.preventDefault();
		};

		form.action = '#';

		const textArea = document.createElement('textArea');
		textArea.id = 'textArea';
		textArea.appendChild(document.createTextNode('Hello'));
		form.appendChild(textArea);

		const submitButton = document.createElement('button');
		submitButton.appendChild(document.createTextNode('Submit'));
		form.appendChild(submitButton);
		form.on;
	}

	function displayPagination() {
		if (items.length > pageSize) {
			const div = document.createElement('div');
			const pages = Math.ceil(items.length / pageSize);
			for (let i = 1; i <= pages; i++) {
				const span = document.createElement('span');
				const link = document.createElement('a');
				link.href = '';

				link.onclick = function (e) {
					e.preventDefault();
					pageNum = i;
					const lastIndex = pageNum * pageSize;
					displayList(items.slice(lastIndex - pageSize, lastIndex));
				};

				const text = document.createTextNode(i);

				link.classList.add(pageNum === i ? 'selectedPage' : 'noLink');
				link.classList.add('allPages');
				link.appendChild(text);

				span.appendChild(link);
				div.appendChild(span);
			}
			app.insertAdjacentElement('afterend', div);
		}
	}

	function displayUndoDeleteButton() {
		if (showUndoDelete) {
			const undoDeleteButton = document.createElement('button');
			undoDeleteButton.appendChild(document.createTextNode('Undo All Delete'));
			undoDeleteButton.onclick = function () {
				const newItems = currentPageItems.map((item) => {
					item.isDeleted = false;
					return item;
				});
				displayList(newItems);
			};
		}
	}

	function addSeparator(elem) {
		elem.insertAdjacentElement('afterend', document.createElement('br'));
	}

	window.addEventListener('keyup', (e) => {
		console.log(e);
	});
})();
