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
		var band = new Band(gl);
		var triangle = new Triangle(gl);
	
		// dimensions
		var head_size = [4, 4, 4];
		var torso_size = [8, 16, 6];
		var neck_size = [1, 1, 1];
		var arm_size = [2, 4, 2];
		var hand_size = [1, 1, 1];
		var joint_size = head_size[0]/2;
		
		
		// skeleton
		this.robot = new SceneNode("robot");
		mat4.scale(this.robot.transformation, [0.05, 0.05, 0.05]);
		
		// neck 
		this.neck = new SceneNode("neck");
		mat4.translate(this.neck.transformation, [0, (torso_size[1]+neck_size[1])/2, 0]);
		// head
		this.head = new SceneNode("head");
		var headY = neck_size[1]+(torso_size[1] + head_size[1])/2;
		mat4.translate(this.head.transformation, [0, headY, 0]);
		
		// arm



		this.hand = new SceneNode("hand");
		mat4.translate(this.hand.transformation, [0, -arm_size[1], 0]);
		
		this.armPart2 = new SceneNode("armPart2",[this.hand]);
		mat4.translate(this.armPart2.transformation, [0, -arm_size[1]/2, 0]);
		this.joint = new SceneNode("joint",[this.armPart2]);
		this.armPart1 = new SceneNode("armPart1",[this.joint]);
		mat4.translate(this.armPart1.transformation, [0, arm_size[1]/2, 0]);
		this.shoulder = new SceneNode("shoulder", [this.armPart1]);
		mat4.translate(this.shoulder.transformation, [0, arm_size[1], 0]);
		this.arm = new SceneNode("arm",[this.shoulder]);
		mat4.translate(this.arm.transformation, [torso_size[0]/2, 1, 0]);
		
		this.torso = new SceneNode("torso", [this.head, this.neck, this.arm]);
		
		//Skins
		var torsoSkin = new SceneNode("torsoSkin", [cube], programs.vertexColor);
		mat4.scale(torsoSkin.transformation, torso_size);
		var headSkin = new SceneNode("headSkin", [cube], programs.vertexColor);
		mat4.scale(headSkin.transformation, head_size);
		var neckSkin = new SceneNode("neckSkin", [cube], programs.vertexColor);
		//mat4.scale(neckSkin.transformation, neck_size);
		var handSkin = new SceneNode("handSkin", [triangle], programs.vertexColor);
		mat4.scale(handSkin.transformation, hand_size);
		var shoulderSkin = new SceneNode("shoulderSkin", [cube], programs.vertexolor);
		mat4.scale(shoulderSkin.transformation, joint_size);
		var armPartSkin = new SceneNode("armPartSkin", [cube], programs.vertexColor);
		mat4.scale(armPartSkin.transformation, arm_size);
		var jointSkin = new SceneNode("jointSkin", [cube], programs.vertexColor);
		mat4.scale(jointSkin.transformation, joint_size);
		// bind skeletons and skins
		this.hand.addObjects([handSkin]);
		this.shoulder.addObjects([shoulderSkin]);
		this.armPart1.addObjects([armPartSkin]);
		this.armPart2.addObjects([armPartSkin]);
		//this.joint.addObjects([jointSkin]);
		//this.arm.addObjects([handSkin, shoulderSkin, armPartSkin, this.joint]);
		this.torso.addObjects([torsoSkin]);
		this.head.addObjects([headSkin]);
		this.neck.addObjects([neckSkin]);
		this.robot.addObjects([this.torso, this.head, this.arm]);
	
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program, transformation) {
		this.robot.draw(gl, program, transformation);
         
    };
        
    // this module only returns the constructor function    
    return Robot;

})); // define

    
