# GradientCreator
Javascript gradient creator

# Examples

https://squarific.github.io/GradientCreator/

Used in other projects:

http://www.anondraw.com

Let me know if you use this so I can add you to the list!

# How to use

```javascript
	var container = document.getElementById("somecontainer");

	var gradientCreator = new GradientCreator(container);
	gradientCreator.addEventListener("change", function (event) {
		// event.type = "change"
		console.log(event.gradient); // event gradient is an object explained below
	});
```

On a change this will output something like:

```javascript
	{
		"type": "linear",	
		"stops": [
			{"pos": 0.000, "color": tinycolor()},
			{"pos": 0.481, "color": tinycolor()}
		]
	}
```

The type can be either linear or radial.
Color is hex8, position is a number between 0 and 1 inclusive.
You should not assume that because the change event has fired that something did in fact change.

# Dependencies

// Spectrum Colorpicker v1.6.0    
// https://github.com/bgrins/spectrum    
// Author: Brian Grinstead    
// License: MIT

Spectrum requires jQuery, so that is needed aswell.    
If you do not want to load jQuery you can switch out spectrum to another color picker.    
By default if removed it will use the browsers <input type="color" />