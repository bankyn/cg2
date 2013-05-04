/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "parametric_curve"], 
       (function(Util,vec2,Scene,PointDragger,ParametricCurve) {
       
    "use strict";
	
	var bezier = function(p0,p1,p2,p3) {
		return function(t) {
			return (-p0 + 3 * p1 - 3 * p2 + p3)*Math.pow(t,3)
					+ (3 * p0 - 6 * p1 + 3*p2) * Math.pow(t,2)
					+ (-3 * p0 + 3 * p1)*t + p0;
		};
	};
	
	var BezierCurve = function(lineStyle, p0, p1, p2 , p3) {
		var xt = bezier(p0[0],p1[0],p2[0],p3[0]); 
		var yt = bezier(p0[1],p1[1],p2[1],p3[1]);
		this.curve = new ParametricCurve(lineStyle, xt, yt, 0.0, 1.0);	
		this.lineStyle = lineStyle;	
		this.p0 = p0;		
		this.p1 = p1;		
		this.p2 = p2;		
		this.p3 = p3;		
	};
	
	BezierCurve.prototype.draw = function(context) {
		this.curve.draw(context);
	};
	
	BezierCurve.prototype.createDraggers = function() {
		return [];
	};

	
	BezierCurve.prototype.isHit = function(context,pos) {
		return this.curve.isHit(context,pos);
	};
	
	return BezierCurve;
}));