/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "straight_line"], 
       (function(Util,vec2,Scene,PointDragger,StraightLine) {
       
    "use strict";

	var ParametricCurve = function(lineStyle, xt, yt, mint, maxt, segments, tickmarks) {
		this.lineStyle = lineStyle || {width:"2", color:"#0000AA"};
		
		this.xt = xt || function (t) { return 100*Math.sin(t)};
		this.yt = yt || function(t) { return 100*Math.cos(t)};
	
		this.mint = mint || 0;
		this.maxt = maxt || 5;
		this.segments = segments || 20;
		this.tickmarks = tickmarks || false;
		this.lines = new Array(this.segments);
		createSegments(this);
	};
	
	// creates straight line objects as segments for this parametric curve
	var createSegments = function(curCurve) {
		var points = new Array(curCurve.segments+1);
		for(var _index=0; _index < curCurve.segments+1; _index++) {
			var t = curCurve.mint + _index/curCurve.segments * (curCurve.maxt-curCurve.mint);
			//points[_index] = [eval(curCurve.xt),eval(curCurve.yt)];
			points[_index] = [curCurve.xt(t),curCurve.yt(t)];
		}
		
		for(var _index=1; _index < curCurve.segments+1; _index++) {
			curCurve.lines[_index-1] = new StraightLine(points[_index-1],points[_index],curCurve.lineStyle);
		}
	};
	
	ParametricCurve.prototype.createDraggers = function() {
		return [];
	};
	
	ParametricCurve.prototype.isHit = function(context,pos) {
		for(var _index=0; _index < this.segments; _index++) {
			if(this.lines[_index].isHit(context,pos)) return true;
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