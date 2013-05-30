/*
 *
 * Module: Robot
 *
 */


/* requireJS module definition */
define(["util", "vbo", "triangle", "band", "cube", "scene_node","gl-matrix"], 
       (function(Util, vbo, Triangle, Band, Cube, SceneNode, dummy) {
       
    "use strict";
    
    // constructor, takes WebGL context object as argument
    var Robot = function(gl) {
		
		var cube = new Cube(gl);
		var band = new Band(gl, {radius: 0.5, height: 1.0, segments: 30});
		var triangle = new Triangle(gl);
		// Dimensions
		var torso_size = [0.8, 2.0, 0.5];
		//Skeleton
		this.head = new SceneNode("head");
		this.neck = new SceneNode("neck");
		
		this.shoulder = new SceneNode("shoulder");
		this.hand = new SceneNode("hand");
		this.joint = new SceneNode("joint");
		this.arm = new SceneNode("arm");
		this.limb = new SceneNode("limb", [this.shoulder, this.hand, this.joint, this.arm]);
		this.torso = new SceneNode("torso", [this.hand]);
		//Skins
		var torsoSkin = new SceneNode("torsoSkin", [cube], programs.vertexColor);
       												
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program, transformation) {
		this.torso.draw(gl, program, transformation);
         
    };
        
    // this module only returns the constructor function    
    return Robot;

})); // define

    
