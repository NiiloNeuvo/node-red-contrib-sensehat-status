/**
 * Utility for making color gradients.
 */

var colorConvert = require('color-convert'); // Color conversion

/**
 * Utility for taking multiple color points and mapping which color it.
 */
module.exports.Gradient = function() {
  return {
    defaultColor : null,

    // List of {value:value, index:index, color:[r,g,b], original:
    // originalColor}
    points : [],

    /**
     * Parses a color out of a string. Returns null on errors.
     */
    parseColor : function(color) {
      return colorConvert.keyword.rgb(color) || colorConvert.hex.rgb(color)
          || null;
    },

    /**
     * Creates a color String in the format #RRGGBB
     */
    stringColor : function(colorArray) {
      return "#" + colorConvert.rgb.hex(colorArray);
    },

    /**
     * Adds a value to color mapping point. Returns false if value is not
     * possible to parse to a number or if color is invalid.
     * <p>
     * Multiple points can be added to the same position. Insertion order
     * defines priority when match. For example:
     * </p>
     * <code>
     * gradientMaker.addPoint( 10, blue );
     * gradientMaker.addPoint( 10, red );
     * </code>
     * Will return blue up to 10 and after it red.
     */
    addPoint : function(value, color) {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        return false;
      }
      var parsedColor = parseColor(color);
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
        return a.value == b.value ? b.index - a.index : b.value - a.value;
      });
      return true;
    },

    /**
     * Sets the default color. defaultColor is returned if the value provided is
     * not a number or no points have been added.
     */
    setDefault : function(color) {
      this.defaultColor = stringColor(parseColor(color));
    },

    blend : function(color1, color2, ratio) {
      var d = (value - val1) / (val2 - val1);
      return [ (col2[0] - col1[0]) * d + col1[0],
          (col2[1] - col1[1]) * d + col1[1], (col2[2] - col1[2]) * d + col1[2], ];

    },

    /**
     * Returns a calculated gradient value. Format returned is String
     * presentation in #RRGGBB.
     */
    gradient : function(value) {
      if (isNaN(value) || this.points.length == 0) {
        return defaultColor;
      }
      var prevPoint = null;
      this.points.forEach(function(point) {
        if (value == point[0] || (prevPoint == null && value < point[0])) {
          return point.original;
        }
        if (value < point[1]) {
          var blend = (value - prevPoint[0]) / (val2 - val1);
          return stringColor(blend(prevPoint.color, point.color, blend));
        }
        prevPoint = point;
      });
      return prevPoint.original;
    },

    /**
     * Returns the closest color. Format returned is String presentation in
     * #RRGGBB.
     */
    closest : function(value) {
      if (isNaN(value) || this.points.length == 0) {
        return this.defaultColor;
      }
      var prevPoint = null;
      this.points.forEach(function(point) {
        if (value > point.value) {
          prevPoint = point;
          continue;
        }
        if (prevPoint == null
            || Math.abs(point.value - value) < Math
                .abs(prevPoint.value - value)) {
          return point.original;
        } else {
          return prevPoint.original;
        }
      });
      return prevPoint.original;
    },

    /**
     * Returns the number of items stored into the gradient
     */
    flength : function() {
      return this.points.length;
    },
  }
};
