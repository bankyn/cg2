/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["jquery", "gl-matrix", "util", "program", "shaders", "scene_node", 
        "models/parametric", "light", "material", "texture"], 
       (function($, glmatrix, util, Program, Shader, SceneNode,
                 parametric, light, material, texture ) {

    "use strict";
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  

        // object to hold all GPU programs            
        this.programs = {};

        // create WebGL program for phong illumination 
        this.programs.phong = new Program(gl, Shader("phong_vs"), 
                                              Shader("phong_fs")  );
        this.programs.phong.use();
        this.programs.phong.setUniform("ambientLight", "vec3", [0.4,0.4,0.4]);

        // in 3.2 create textures from image files here...
        
        // in 3.2, bind textures to GPU programs in the following callback func
        var _scene = this;
        texture.onAllTexturesLoaded( (function() { 
            // ...
            _scene.draw();
        } ));

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.worldTransformation = mat4.identity();

        // light source 
        this.sun = new light.DirectionalLight("light",  
                                              {"direction": [-1,0,0], "color": [1,1,1] },
                                              [this.programs.phong]); 
        this.sunNode = new SceneNode("Sunlight", [this.sun]);
                                
        // equator ring for orientation
        this.ringGeometry = new parametric.Torus(gl, 1.2, 0.04, {"uSegments":80, "vSegments":40});
        this.ringMaterial = new material.PhongMaterial("material", 
                                                       {"ambient":   [0.1,0.1,0.2],
                                                        "diffuse":   [0.8,0.2,0.2],
                                                        "specular":  [0.4,0.4,0.4],
                                                        "shininess": 80              });
        this.ringNode     = new SceneNode("Ring", [this.ringMaterial, this.ringGeometry], this.programs.phong);
        // need to rotate the ring so it is in the X-Z-plane
        mat4.rotate(this.ringNode.transformation, Math.PI/2, [1,0,0]);

        // planet
        this.planetSurface = new parametric.Sphere(gl, 1.0, {"uSegments": 80, "vSegments": 80 });
        this.planetMaterial = this.ringMaterial;
        this.planetNode = new SceneNode("Planet", [this.planetMaterial, this.planetSurface], this.programs.phong);
        // rotate sphere so the poles are on the Y axis
        mat4.rotate(this.planetNode.transformation, Math.PI/2, [1,0,0]);

        // the root node is our little "universe"
        this.universe = new SceneNode("Universe", [this.sunNode, this.planetNode, this.ringNode], this.programs.phong);

        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { 
                             "Show Planet": true,
                             "Show Ring": false,
                             };                       
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = mat4.perspective(45, aspectRatio, 0.01, 100);

        // multiple world and camera transformations to obtain model-view matrix
        var modelViewMatrix = mat4.create(this.cameraTransformation); 
        mat4.multiply(modelViewMatrix, this.worldTransformation);

        // set common uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
        }
        
        // clear color and depth buffers
        gl.clearColor(0.0, 0.0, 0.0, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  

        // show/hide certain parts of the scene            
        this.ringNode.visible = this.drawOptions["Show Ring"];
        this.planetNode.visible = this.drawOptions["Show Planet"];

        // draw the scene 
        this.universe.draw(gl, this.programs.blue, modelViewMatrix);
    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {

        window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees." );

        // degrees to radians
        angle = angle*Math.PI/180;
        
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {
            case "worldY": 
                mat4.rotate(this.worldTransformation, angle, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.worldTransformation, angle, [1,0,0]);
                break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };

        // redraw the scene
        this.draw();
    }

    return Scene;            
    
})); // define module
        

