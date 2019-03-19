/**
 * 
 */
module.exports = function(RED) {
	var colorConvert = require( 'color-convert' ); // Color conversion
	var sensehat = require( 'sense-hat-led' ); // SenseHat tooling
	var icons = require( './icons.js' ); // The icons
	
	function SenseHatStatus(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		
		node.status({
			fill : "blue",
			shape : "circle",
			text : "Waiting for input."
		});
		
		node.on('input', function(msg) {
					
			var context = node.context();
			var index = parseInt( msg.payload.index, 10 );
			if( index > 0 &&index < 5 ) {
				var icon = msg.payload.icon || "x";
				var color = colorConvert.keyword.rgb( msg.payload.color) || [128,0,0];
				context.set( index+"", [icon, color ] );
				node.status({
					fill : "green",
					shape : "dot",
					text : ""
				});
			} else {
				node.status({
					fill : "red",
					shape : "dot",
					text : "No 'index'"
				});
			}
			
			
	   		var c1 = context.get("1") || ["x", [128,128,128]];
			var i1 = icons.fourByFour( c1[0], c1[1] );
	    	var c2 = context.get("2") || ["x", [128,128,128]];
			var i2 = icons.fourByFour( c2[0], c2[1] );
		    var c3 = context.get("3") || ["x", [128,128,128]];
			var i3 = icons.fourByFour( c3[0], c3[1] );
	    	var c4 = context.get("4") || ["x", [128,128,128]];
			var i4 = icons.fourByFour( c4[0], c4[1] );
			var icon = icons.mergeFour( i1, i2, i3 , i4 );
			sensehat.setPixels(icon, (err) => {
				if( err ) {
					node.warn( "sensehat: " + err );
				}
			});
		});
	}

	function SenseHatStatusSource(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		node.status({
			fill : "blue",
			shape : "circle",
			text : "Waiting for input."
		});

		node.on('input', function(msg) {
			node.status({
				fill : "green",
				shape : "dot",
				text : ""
			});
			node.send( msg );
		});
	}

	RED.nodes.registerType("sensehat-status", SenseHatStatus, {
		settings : {
		// Empty
		}
	});
	RED.nodes.registerType("sensehat-status-source", SenseHatStatusSource, {
		settings : {
		// Empty
		}
	});
}