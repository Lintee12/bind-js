"use strict";
class Bind {
	constructor() {
		this.rootElement = null;
		this.initialDOM = [];
		this.currentDOM = [];
		this.lastUpdate = {};
	}

	getVarLength(variable) {
		return Object.keys(variable).length;
	}

	getVarData(variable, index) {
		const key = Object.keys(variable)[index];
		const value = typeof variable[key] === "function" ? variable[key]() : variable[key];
		return {
			name: key,
			value: value,
		};
	}

	htmlValue(name) {
		return "{{" + name + "}}";
	}

	getElement = (selector) => {
		return this.rootElement.querySelector(selector);
	};

	bind = (selector, event, func) => {
		const element = this.getElement(selector);
		element.addEventListener(event, func);
	};

	render(root, { properties, methods }, callback) {
		this.rootElement = document.querySelector(root);
		this.initialDOM = Array.from(this.rootElement.cloneNode(true).getElementsByTagName("*"));
		this.currentDOM = Array.from(this.rootElement.getElementsByTagName("*"));

		if (typeof callback === "function") callback();

		this.updateDOM(properties);

		setInterval(() => {
			for (let i = 0; i < this.getVarLength(properties); i++) {
				const data = this.getVarData(properties, i);
				if (this.lastUpdate[i] && this.lastUpdate[i].value !== data.value) {
					this.updatePropertyInDOM(properties, data.name);
				}
				this.lastUpdate[i] = {
					value: data.value,
				};
			}
		}, 0);

		if (methods) {
			for (const methodName in methods) {
				if (Object.hasOwnProperty.call(methods, methodName)) {
					methods[methodName]();
				}
			}
		}
	}

	updatePropertyInDOM(properties, property) {
		this.initialDOM.forEach((element, index) => {
			for (let i = 0; i < this.getVarLength(properties); i++) {
				const data = this.getVarData(properties, i);
				if (element.innerHTML.includes(this.htmlValue(property))) {
					if (element.innerHTML.includes(this.htmlValue(data.name)) && element.children.length === 0) {
						this.currentDOM[index].innerHTML = element.innerHTML.replace(this.htmlValue(data.name), data.value);
					}
				}
			}
		});
	}

	updateDOM(properties) {
		this.initialDOM.forEach((element, index) => {
			for (let i = 0; i < this.getVarLength(properties); i++) {
				const data = this.getVarData(properties, i);
				if (element.innerHTML.includes(this.htmlValue(data.name)) && element.children.length === 0) {
					this.currentDOM[index].innerHTML = element.innerHTML.replace(this.htmlValue(data.name), data.value);
				}
			}
		});
	}
}

export default Bind;
