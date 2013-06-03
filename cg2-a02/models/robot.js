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
    var Robot = function(gl, programs, config) {
		
		// components
		var cube = new Cube(gl);
		var band = new Band(gl, {radius: 2, height: 2, segments: 30});
	
		// dimensions
		var head_size = [4.0, 4.0, 4.0];
		var torso_size = [8.0, 16.0, 5.0];
		var arm_size = [2.0, 4.0, 2.0];
		
		// skeleton
		// the neck is one part of the head
		this.neck = new SceneNode("neck");
		// ???Band Ursprung???   position of the neck is [0, TB/2, 0]
		
		// head
		this.head = new SceneNode("head", [this.neck]);
		// position of the head is [0-2, TB/2 + HB, 0-2]; 
		mat4.translate(head.transformation, [head_size[0]/2, torso_size[0] + HB + head_size[1]/2, head_size[2]/2]);
		
		
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

    
