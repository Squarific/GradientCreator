/*
	LICENSE: MIT
	Author: Filip Smets
*/

/*
	Creates the creator
	Everything inside container could be removed
	All properties of container could be overwritten, including style
*/
function GradientCreator (container) {
	this._container = container;
}

GradientCreator.prototype.TYPES = ["linear", "radial"];

/*
	#################
	# DOM FUNCTIONS #
	#################
*/

/*
	Removes everything inside the container, then creates all elements
	Container will be taken from this._container
*/
GradientCreator.prototype.setupDom = function setupDom () {
	// Remove all elements in the container
	while (this._container.firstChild)
		this._container.removeChild(this._container.firstChild)

	this.createTypeSelectorDom();
	this.createPreviewDom();
};

/*
	Appends a form with all the gradient types to the this._container element
*/
GradientCreator.prototype.createTypeSelectorDom = function createTypeSelectorDom () {
	var form = this._container.appendChild(document.createElement("form"));
	form.classList.add("gradient-type-form");

	// This raises the chance of all ids being unique as per html spec
	var idPrefix = Date.now();

	this.TYPES.forEach(function (currentValue, index, array) {
		var label = form.appendChild(document.createElement("label"));
		label.appendChild(document.createElement(currentValue));
		label.for = idPrefix + currentValue;

		var input = form.appendChild(document.createElement("input"));
		input.id = idPrefix + currentValue;
		input.type = "radio";
		input.name = "gradienttype";
		input.value = currentValue;
	});	
};

GradientCreator.prototype.createPreviewDom = function createPreviewDom () {
	var preview = this._container.appendChild(document.createElement("div"));
	preview.classList.add("gradient-preview");
};