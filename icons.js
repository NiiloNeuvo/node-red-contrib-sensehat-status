/**
 * Icons and utilities for manipulating them.
 */

var C9 = [ 255, 255, 255 ]; // White
var C8 = [ 226, 226, 226 ];
var C7 = [ 198, 198, 198 ];
var C6 = [ 170, 170, 255 ];
var C5 = [ 141, 127, 127 ];
var C4 = [ 102, 102, 102 ];
var C3 = [ 85, 76, 76 ];
var C2 = [ 56, 51, 51 ];
var C1 = [ 28, 25, 25 ];
var C0 = [ 0, 0, 0 ]; // Black

var iconsFour = {
	"circle" : [ C0, C4, C4, C0, C4, C9, C9, C4, C4, C9, C9, C4, C0, C4, C4,
			C0, ],
	"square" : [ C3, C3, C3, C3, C3, C9, C9, C3, C3, C9, C9, C3, C3, C3, C3,
			C3, ],
	"bar" : [ C0, C9, C9, C0, C0, C9, C9, C0, C0, C9, C9, C0, C0, C9, C9, C0, ],
	"dash" : [ C0, C0, C0, C0, C9, C9, C9, C9, C9, C9, C9, C9, C0, C0, C0, C0, ],
	"x": [ 
		C9, C0, C9, C0, 
		C0, C9, C0, C0, 
		C9, C0, C9, C0, 
		C0, C0, C0, C0, ],
};

multiply = function(color1, color2) {
	return [ Math.floor(color1[0] * color2[0] / 255),
			Math.floor(color1[1] * color2[1] / 255),
			Math.floor(color1[2] * color2[2] / 255), ];

}

module.exports.fourByFour = function(name, color) {
	var icon = iconsFour[name] || iconsFour["circle"];
	var ret = new Array(icon.length);
	for (i = 0; i < icon.length; i++) {
		ret[i] = multiply(icon[i], color);
	}
	return ret;
}

module.exports.mergeFour = function(i1, i2, i3, i4) {
	var ret = new Array(i1.length * 4);
	for (var i = 0; i < i1.length; i++) {
		var col = i % 4;
		var row = Math.floor(i / 4);
		ret[col + row * 8] = i1[i];
		ret[col + row * 8 + 4] = i2[i];
		ret[col + (row + 4) * 8] = i3[i];
		ret[col + (row + 4) * 8 + 4] = i4[i];
	}
	return ret;
}