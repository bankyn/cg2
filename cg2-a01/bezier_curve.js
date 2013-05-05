/*
* module: bezier_curve
*
*/

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
		this.lineStyle = lineStyle;	
		
		this.controll_points = []
		this.controll_points.push(p0);
		this.controll_points.push(p1);
		this.controll_points.push(p2);
		this.controll_points.push(p3);		
		this.redraw();
	};
	

	BezierCurve.prototype.redraw = function() {
		console.log("redraw");
		var xt = bezier(this.controll_points[0][0], this.controll_points[1][0], this.controll_points[2][0], this.controll_points[3][0]); 
		var yt = bezier(this.controll_points[0][1], this.controll_points[1][1], this.controll_points[2][1], this.controll_points[3][1]); 
		
		this.curve = new ParametricCurve(this.lineStyle, xt, yt, 0.0, 1.0);	

		};
	BezierCurve.prototype.draw = function(context) {
		this.curve.draw(context);
	};
	
	BezierCurve.prototype.createDraggers = function() {
		var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];
		var _bezier = this;
		
		//create PD
		$.each(this.controll_points, function (idx, val) {
			var getP = function() {  return _bezier.controll_points[idx]; };
			var setP = function(dragEvent) {  _bezier.controll_points[idx] = dragEvent.position; _bezier.redraw();}; 
			draggers.push( new PointDragger(getP, setP, draggerStyle) );
		});
		
        return draggers;
	};

	
	BezierCurve.prototype.isHit = function(context,pos) {
		return this.curve.isHit(context,pos);
	};
	
	return BezierCurve;
}));