/**
 * Test case
 */

var assert = require('assert');
var Gradient = require("../gradient.js");

var gradient = new Gradient();

// Test defaults
gradient.setDefault("#808080");
assert.equal(gradient.length(), 0);
assert.equal(gradient.closest(-1000), "#808080");
assert.equal(gradient.closest(0), "#808080");
assert.equal(gradient.closest(1000), "#808080");

// Data parsing
gradient.create('[[-20,"white"],[0,"blue"],[20,"red"],[40,"orange"]]');
assert.equal(gradient.length(), 4);
var dump = gradient.dump();
assert.equal(typeof dump, "object");
assert.equal(dump.length, 4);
assert.equal(dump[0].value, -20);
assert.equal(dump[0].original, "white");
assert.equal(dump[1].value, 0);
assert.equal(dump[1].original, "blue");
assert.equal(dump[2].value, 20);
assert.equal(dump[2].original, "red");
assert.equal(dump[3].value, 40);
assert.equal(dump[3].original, "orange");

// Test actual gradient
assert.equal(gradient.closest(-25), "white");
assert.equal(gradient.closest(-20), "white");
assert.equal(gradient.closest(-15), "white");
assert.equal(gradient.closest(-5), "blue");
assert.equal(gradient.closest(5.0), "blue");
assert.equal(gradient.closest(15), "red");
assert.equal(gradient.closest(20), "red");
assert.equal(gradient.closest(25), "red");
assert.equal(gradient.closest(35), "orange");
assert.equal(gradient.closest(40), "orange");
assert.equal(gradient.closest(100), "orange");

var gradient = new Gradient();
gradient.setDefault("#808080");
gradient
    .create('[[40,"#0000FF"],[40,"#00FF00"],[80,"#00FF00"],[100,"#FF0000"]]');
assert.equal(gradient.gradient("default"), "#808080");
assert.equal(gradient.gradient(0), "#0000FF");
assert.equal(gradient.gradient(40), "#0000FF");
assert.equal(gradient.gradient(40.001), "#00FF00");
assert.equal(gradient.gradient(60), "#00FF00");
assert.equal(gradient.gradient(80), "#00FF00");
assert.equal(gradient.gradient(90), "#808000");
assert.equal(gradient.gradient(99.999), "#FF0000");
assert.equal(gradient.gradient(100), "#FF0000");
assert.equal(gradient.gradient(100.001), "#FF0000");
assert.equal(gradient.gradient(200), "#FF0000");
