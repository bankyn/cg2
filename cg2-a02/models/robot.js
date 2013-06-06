/*
 *
 * Module: Robot
 *
 */


/* requireJS module definition */
define(["util", "vbo", "models/triangle", "models/band", "models/cube", "scene_node", "gl-matrix"], 
       (function(Util, vbo, Triangle, Band, Cube, SceneNode, dummy) {
       
    "use strict";
    
    // constructor, takes WebGL context object as argument
    var Robot = function(gl, programs, config) {
		
		// components
		var cube = new Cube(gl);
		var band = new Band(gl, {radius: 0.1, height: 0.1, segments: 30});
	
		// dimensions
		var head_size = [0.4, 0.4, 0.4];
		var torso_size = [0.8, 0.16, 0.6];
		var neck_size = [0.1, 0.1]
		var arm_size = [0.2, 0.4, 0.2];
		
		// skeleton
		// the neck is one part of the head
		this.neck = new SceneNode("neck");
		// position of the neck is [0, TB/2, 0]
		mat4.translate(this.neck.transformation, [0, head_size[1], 0]);

		// head
		this.head = new SceneNode("head");
		// position of the head is x = (torso_size[0]-head_size[0])/2, y = neck_size[1]+head_size[1], z = (torso_size[2]-head_size[2])/2
		mat4.translate(this.head.transformation, [(torso_size[0]-head_size[0])/2, (neck_size[1] + head_size[1]), (torso_size[2]-head_size[2])/2]);
		
		/*
		this.shoulder = new SceneNode("shoulder");
		this.hand = new SceneNode("hand");
		this.joint = new SceneNode("joint");
		this.arm = new SceneNode("arm");
		this.limb = new SceneNode("limb", [this.shoulder, this.hand, this.joint, this.arm]);
		*/
		this.torso = new SceneNode("torso", [this.head, this.neck]);
		
		//Skins
		var torsoSkin = new SceneNode("torsoSkin", [cube], programs.vertexColor);
		mat4.scale(torsoSkin.transformation, torso_size);
		var headSkin = new SceneNode("headSkin", [cube], programs.vertexColor);
		mat4.scale(headSkin.transformation, head_size);
		var neckSkin = new SceneNode("neckSkin", [band], programs.vertexColor);
		mat4.scale(neckSkin.transformation, neck_size);
		
		// bind skeletons and skins
		this.torso.addObjects([torsoSkin]);
		this.head.addObjects([headSkin]);
		this.neck.addObjects([neckSkin]);
		
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program, transformation) {
		this.torso.draw(gl, program, transformation);
         
    };
        
    // this module only returns the constructor function    
    return Robot;

})); // define

    
