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
	this.setupDom();
	this.rerender();
}

GradientCreator.prototype.INITIAL_STOPS = [{
	pos: 0,
	color: tinycolor("black")
}, {
	pos: 1,
	color: tinycolor("white")
}];

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

	this.createPreviewDom();
	this.createColorSelector();
};

/*
	Create a div for the preview and add inital colors
*/
GradientCreator.prototype.createPreviewDom = function createPreviewDom () {
	var preview = this._container.appendChild(document.createElement("div"));
	preview.classList.add("gradient-preview");
	this._previewDom = preview;

	document.addEventListener("mousemove", function (event) {
		if (!this._draggingStop) return;
		var relativeHeight = this.getRelativeHeight(event, this._previewDom);

		// Clamp between 0 and 1
		relativeHeight = Math.min(1, Math.max(0, relativeHeight));

		this._draggingStop.style.top = relativeHeight * 100 + "%";
		this.rerender();
	}.bind(this));

	document.addEventListener("touchmove", function (event) {
		if (!this._draggingStop) return;
		var relativeHeight = this.getRelativeHeight(event, this._previewDom);

		// Clamp between 0 and 1
		relativeHeight = Math.min(1, Math.max(0, relativeHeight));

		this._draggingStop.style.top = relativeHeight * 100 + "%";
		this.rerender();
	}.bind(this));

	document.addEventListener("mouseup", function (event) {
		delete this._draggingStop;
	}.bind(this));

	document.addEventListener("touchend", function (event) {
		delete this._draggingStop;
	}.bind(this));

	preview.addEventListener("dblclick", function (event) {
		var relativeHeight = this.getrelativeHeight(event, this._previewDom);
		this.createStop({
			pos: relativeHeight,
			color: tinycolor()
		});
		this.rerender();
	}.bind(this));

	this.INITIAL_STOPS.forEach(this.createStop.bind(this));
};

/*
	This function creates a stop dom element from {pos: 0-1, color: tinycolor/csscolor/...}
*/
GradientCreator.prototype.createStop = function createStop (stop) {
	var stopDom = this._previewDom.appendChild(document.createElement("div"))
	stopDom.className = "gradient-stop";
	stopDom.style.background = stop.color;
	stopDom.style.top = stop.pos * 100 + "%";
	stopDom.color = stop.color;

	stopDom.addEventListener("mousedown", function (event) {
		this._draggingStop = stopDom;
		this.selectStop(stopDom);
	}.bind(this));

	stopDom.addEventListener("touchstart", function (event) {
		this._draggingStop = stopDom;
		this.selectStop(stopDom);
	}.bind(this));

	stopDom.addEventListener("click", function (event) {
		this.deselectStops();
		this.selectStop(event.target);
	}.bind(this))
};

/*
	Deselects all stop elements
*/
GradientCreator.prototype.deselectStops = function deselectStops () {
	for (var key = 0; key < this._previewDom.children.length; key++) {
		this._previewDom.children[key].style.border = "";
	}

	this._selectedStop = undefined;	
};

/*
	Selects the given stop for color manipulation
*/
GradientCreator.prototype.selectStop = function selectStop (stopDom) {
	this.deselectStops();
	this._selectedStop = stopDom;
	stopDom.style.border = "1px inset red";
};

/*
	Creates the color selector
*/
GradientCreator.prototype.createColorSelector = function createColorSelector () {
	var input = this._container.appendChild(document.createElement("input"));
	input.type = "color";

	var spectrum = $(input).spectrum({
		showAlpha: true,
		showInput: true,
		showInitial: true,
		preferredFormat: "rgb",
		showPalette: true,
		maxSelectionSize: 32,
		clickoutFiresChange: true,		
		move: function (color) {
			if (this._selectedStop) {
				this._selectedStop.color = color;
				this._selectedStop.style.background = color;
				this.rerender();
			}
		}.bind(this)
	});
};

/*

	###################
	# General methods #
	###################

*/

/*
	Get an array of the current stops
	Example: [{pos: 0, color: tinycolor()}, {pos: 1, color: tinycolor()}]
*/
GradientCreator.prototype.getStops = function getStops () {
	var stops = [];

	for (var key = 0; key < this._previewDom.children.length; key++) {
		stops.push({
			pos: parseFloat(this._previewDom.children[key].style.top.slice(0, -1)) / 100,
			color: this._previewDom.children[key].color
		});
	}

	stops.sort(function (a, b) {
		return a.pos - b.pos;
	});

	return stops;
};

/*
	Given an event object it will return the relative width between 0 and 1.
	Works with touch events.
*/
GradientCreator.prototype.getRelativeWidth = function getRelativeWidth (event, target) {
	// If there is no clientX/Y (meaning no mouse event) and there are no changed touches
	// meaning no touch event, then we can't get the coords relative to the target element
	// for this event
	if (typeof event.clientX !== "number" && (!event.changedTouches || !event.changedTouches[0] || typeof event.changedTouches[0].clientX !== "number"))
		return 0;

	// Return the coordinates relative to the target element
	var clientX = (typeof event.clientX === 'number') ? event.clientX : event.changedTouches[0].clientX,
	    target = target || event.target || document.elementFromPoint(clientX, clientY);

	var boundingClientRect = target.getBoundingClientRect();
	var relativeX = clientX - boundingClientRect.left;

	return relativeX / boundingClientRect.width;
};

GradientCreator.prototype.getRelativeHeight = function getRelativeHeight (event, target) {
	// If there is no clientX/Y (meaning no mouse event) and there are no changed touches
	// meaning no touch event, then we can't get the coords relative to the target element
	// for this event
	if (typeof event.clientY !== "number" && (!event.changedTouches || !event.changedTouches[0] || typeof event.changedTouches[0].clientY !== "number"))
		return 0;

	// Return the coordinates relative to the target element
	var clientY = (typeof event.clientY === 'number') ? event.clientY : event.changedTouches[0].clientY,
	    target = target || event.target || document.elementFromPoint(clientX, clientY);

	var boundingClientRect = target.getBoundingClientRect();
	var relativeY = clientY - boundingClientRect.top;

	return relativeY / boundingClientRect.height;
};


/*
	Replace the css of the preview div to match the stops
*/
GradientCreator.prototype.rerender = function rerender () {
	var parsedStops = this.getStops().map(function (stop, index, stops) {
		return stop.color + " " + stop.pos * 100 + "%";
	});

	this._previewDom.style.background = "linear-gradient(180deg, " + parsedStops.join(",") + ")";
};

/**
 * Event dispatcher
 * License mit
 * https://github.com/mrdoob/eventdispatcher.js
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher = function () {}

EventDispatcher.prototype = {

	constructor: EventDispatcher,

	apply: function ( object ) {

		object.addEventListener = EventDispatcher.prototype.addEventListener;
		object.hasEventListener = EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = EventDispatcher.prototype.dispatchEvent;

	},

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	dispatchEvent: function ( event ) {
			
		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}

};

EventDispatcher.prototype.apply(GradientCreator.prototype);