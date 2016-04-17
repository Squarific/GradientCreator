# GradientCreator
Javascript gradient creator

# How to use

```javascript
	var container = document.getElementById("somecontainer");

	var gradientCreator = new GradientCreator(container);
	gradientCreator.addEventListener("change", function (event) {
		console.log(event.gradient);
	});
```

On a change this will output something like:

```json
	{
		type: "linear", //or radial	
		stops: [
			{pos: 0.000, color: "2434AABB"}, // Color is hex8, without the #
			{pos: 0.481, color: "FFFFFFFF"} // Position is a number between 0 and 1 inclusive
		]
	}
```

# Dependencies

// Spectrum Colorpicker v1.6.0
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

Spectrum requires jQuery, so that is needed aswell.    
If you do not want to load jQuery you can switch out spectrum to another color picker.    
By default if removed it will use the browsers <input type="color" />