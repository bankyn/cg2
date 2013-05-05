/*
 *
 * Module: control_polygon_drawer
 *
 * draws control polygon to bezier curve. this module provides no interactive funktions, 
 * it only draws the polygon, if the object is selected
 */


/* requireJS module definition */
define(["util", "scene", "straight_line"], 
       (function(Util,Scene, StraightLine) {

    "use strict";

	// init method of the CPDrawer. 
	// Takes a funtion, which returns an array with the controll points 
    var CPDrawer = function(get_points, drawStyle) {
		//save the getter function
		this.get_points = get_points;
		
        // default draw style for the dragger
        drawStyle = drawStyle || {};
        this.drawStyle = {};
        this.drawStyle.radius = drawStyle.radius || 5;
        this.drawStyle.width = drawStyle.width || 2;
        this.drawStyle.color = drawStyle.color || "#ff0000";
        this.drawStyle.fill = drawStyle.fill || false;
        
        // attribute queried by SceneController to recognize draggers
        this.isDragger = false; 
                                        
    };

    /*
     * draw line segements connecting the controll points
     */
    CPDrawer.prototype.draw = function (context) {
		
		var points = this.get_points();
		// draw line segments between the controll points.
		for(var i = 0 ; i < points.length-1; i++){ 
			var line = new StraightLine(points[i],points[i+1], this.drawStyle);
			line.draw(context);
		}
        
    };

 

    // this module exposes only the constructor for CPDrawer objects
    return CPDrawer;

})); // define
