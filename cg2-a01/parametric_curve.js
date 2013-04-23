/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "straight_line"], 
       (function(Util,vec2,Scene,PointDragger,StraightLine) {
       
    "use strict";

	var ParametricCurve = function(lineStyle, xt, yt, mint, maxt, segments, tickmarks) {
		this.lineStyle = lineStyle || {width:"2", color:"#0000AA"};
		this.xt = xt || "100*Math.sin(t)";
		this.yt = yt || "100*Math.cos(t)";
		this.mint = mint || 0;
		this.maxt = maxt || 5;
		this.segments = segments || 20;
		this.tickmarks = tickmarks || false;
		this.lines = new Array(this.segments);
		//straight line objekte ins array speichern,
		//hier wird das konstrukt zum zeichnen erstellt
	};
	
	ParametricCurve.prototype.isHit() {
		for(var _index=0; _index < this.segments; _index++) {
			if(this.lines[_index].isHit) return true;
		}
		return false;
	};
	
	ParametricCurve.prototype.draw = function(context) {
		for(var _index=0; _index < this.segments; _index++) {
			this.lines[_index].draw(context);
		}
	};
	
	return ParametricCurve;
}));