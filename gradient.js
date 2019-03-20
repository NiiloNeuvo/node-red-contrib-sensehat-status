/**
 * Utility for making color gradients.
 */

var colorConvert = require('color-convert'); // Color conversion
const util = require('util');
/**
 * Utility for taking multiple color points and mapping which color it.
 */
function Gradient() {
  this.defaultColor = null;
  this.points = [];
}

/**
 * Parses a color out of a string. Returns null on errors.
 */
Gradient.prototype.parseColor = function(color) {
  return colorConvert.keyword.rgb(color) || colorConvert.hex.rgb(color) || null;
};

/**
 * Creates a color String in the format #RRGGBB
 */
Gradient.prototype.stringColor = function(colorArray) {
  return "#" + colorConvert.rgb.hex(colorArray);
};

/**
 * Adds a value to color mapping point. Returns false if value is not possible
 * to parse to a number or if color is invalid.
 * <p>
 * Multiple points can be added to the same position. Insertion order defines
 * priority when match. For example:
 * </p>
 * <code>
 * gradientMaker.addPoint( 10, blue );
 * gradientMaker.addPoint( 10, red );
 * </code>
 * Will return blue up to 10 and after it red.
 */
Gradient.prototype.addPoint = function(value, color) {
  value = parseInt(value, 10);
  if (isNaN(value)) {
    return false;
  }
  var parsedColor = this.parseColor(color);
  if (parsedColor == null) {
    return false;
  }
  this.points.push({
    value : value,
    index : this.points.lenght, // Retain order
    color : parsedColor,
    original : color
  });
  this.points.sort(function(a, b) {
    return a.value == b.value ? a.index - b.index : a.value - b.value;
  });
  return true;
};

/**
 * Sets the default color. defaultColor is returned if the value provided is not
 * a number or no points have been added.
 */
Gradient.prototype.setDefault = function(color) {
  this.defaultColor = this.stringColor(this.parseColor(color));
};

/**
 * <div>Creates from a json structure formatted as: </div> <code>
 * [[-20,"white"],[0,"blue"],[20,"red"],[40,"orange"]]
 * </code>
 */
Gradient.prototype.create = function(json) {
  if (typeof json == "string") {
    json = JSON.parse(json);
  }
  if (typeof json != "object" || json.length == 0) {
    return;
  }
  for (var i = 0; i < json.length; i++) {
    var individual = json[i];
    if (individual.length == 2) {
      this.addPoint(individual[0], individual[1]);
    }
  }

};

Gradient.prototype.blend = function(col1, col2, d) {
  return [ (col2[0] - col1[0]) * d + col1[0],
      (col2[1] - col1[1]) * d + col1[1], (col2[2] - col1[2]) * d + col1[2], ];

};

/**
 * Returns a calculated gradient value. Format returned is String presentation
 * in #RRGGBB.
 */
Gradient.prototype.gradient = function(value) {
  if (isNaN(value) || this.points.length == 0) {
    return this.defaultColor;
  }
  var prevPoint = null;
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    if (value == point.value || (prevPoint == null && value < point.value)) {
      return point.original;
    }
    if (value < point.value) {
      var ratio = (value - prevPoint.value) / (point.value - prevPoint.value);
      return this.stringColor(this.blend(prevPoint.color, point.color, ratio));
    }
    prevPoint = point;
  }
  return prevPoint.original;
};

/**
 * Returns the closest color. Format returned is String presentation in #RRGGBB.
 */
Gradient.prototype.closest = function(value) {
  if (isNaN(value) || this.points.length == 0) {
    return this.defaultColor;
  }
  var prevPoint = null;
  for (var i = 0; i < this.points.length; i++) {
    var point = this.points[i];
    if (value > point.value) {
      prevPoint = point;
      continue;
    }
    if (prevPoint == null
        || Math.abs(point.value - value) < Math.abs(prevPoint.value - value)) {
      return point.original;
    } else {
      return prevPoint.original;
    }
  }
  return prevPoint.original;
};

/**
 * Returns the number of items stored into the gradient
 */
Gradient.prototype.length = function() {
  return this.points.length;
};

/**
 * Returns the gradient points we have stored.
 */
Gradient.prototype.dump = function() {
  return this.points;
}

module.exports = Gradient;
