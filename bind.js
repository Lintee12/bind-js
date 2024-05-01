"use strict";
class Bind {
	constructor() {
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

	render(root, app, callback) {
		const rootElement = document.querySelector(root);
		this.initialDOM = Array.from(rootElement.cloneNode(true).getElementsByTagName("*"));
		this.currentDOM = Array.from(rootElement.getElementsByTagName("*"));

		if (typeof callback === "function") callback();

		this.updateDOM(app);

		setInterval(() => {
			for (let i = 0; i < this.getVarLength(app); i++) {
				const data = this.getVarData(app, i);
				if (this.lastUpdate[i] && this.lastUpdate[i].value !== data.value) {
					console.log(`updating ${data.name}`);
					this.updatePropertyInDOM(app, data.name);
				}
				this.lastUpdate[i] = {
					value: data.value,
				};
			}
		}, 0);
	}

	updatePropertyInDOM(app, property) {
		this.initialDOM.forEach((element, index) => {
			for (let i = 0; i < this.getVarLength(app); i++) {
				const data = this.getVarData(app, i);
				if (element.innerHTML.includes(this.htmlValue(property))) {
					if (element.innerHTML.includes(this.htmlValue(data.name)) && element.children.length === 0) {
						this.currentDOM[index].innerHTML = element.innerHTML.replace(this.htmlValue(data.name), data.value);
					}
				}
			}
		});
	}

	updateDOM(app) {
		this.initialDOM.forEach((element, index) => {
			for (let i = 0; i < this.getVarLength(app); i++) {
				const data = this.getVarData(app, i);
				if (element.innerHTML.includes(this.htmlValue(data.name)) && element.children.length === 0) {
					this.currentDOM[index].innerHTML = element.innerHTML.replace(this.htmlValue(data.name), data.value);
				}
			}
		});
	}
}

export default Bind;
