/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
       
    "use strict";
	
	var Circle = function(pm, radius, lineStyle) {
		this.lineStyle = lineStyle || {width: "2" , color: "#0000AA"};
		this.pm = pm || [10,10];
		this.radius = radius || 10;
	};
	
	Circle.prototype.draw = function(context) {
		context.beginPath();
		context.arc(this.pm[0], this.pm[1], this.radius, 0, Math.PI*2, 0);
		
		// set drawing style
		context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;
        
        // actually start drawing
        context.stroke();
	};
	
    // test whether the mouse position is on the circle outline
    Circle.prototype.isHit = function(context,pos) {
		// Vector length between circle middle and mouse position
		var cirlength = vec2.length(vec2.sub(pos,this.pm));
		// Tolerance interval for selecting
		return cirlength >= this.radius -2 && cirlength <= this.radius + 2;
	};
	
	// return list of draggers to manipulate this circle
    Circle.prototype.createDraggers = function() {
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];
		var _circle = this;
        var getPm = function() { return _circle.pm };
		var setPm = function(dragEvent) { _circle.pm = dragEvent.position; };
		var getPp = function() { return [_circle.pm[0]+_circle.radius,_circle.pm[1]]};
		var setPp = function(dragEvent) { 
			var dx = _circle.pm[0];
			if(dragEvent.position[0] > _circle.pm[0]) {
				dx = (-dx) + dragEvent.position[0];
			} else {
				dx -= dragEvent.position[0];
			}
			_circle.radius = dx;
		};
        draggers.push( new PointDragger(getPm, setPm, draggerStyle) );
		draggers.push( new PointDragger(getPp, setPp, draggerStyle) );
        return draggers;
	};
	
	return Circle;
}));