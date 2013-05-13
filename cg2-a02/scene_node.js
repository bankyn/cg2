/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: SceneNode
 *
 * A SceneNode is a container for a transformation, a program, 
 * and a list of drawable objects.
 *
 * The drawable objects can themselves be SceneNodes. This way 
 * hierarchical modeling is supported.
 *
 * The program and the transformation are optional; however 
 * at a minimum you must specify a program for the root node. 
 *
 * - the transformation associated with the node can be  
 *   accessed directly via the attribute "transformation".
 *
 * - the program associated with the node can be accessed 
 *   directly via the attribute "program".
 *
 * - drawable objects can be added via the addObjects() method,
 *   and can be removed again using the removeObjects() method.
 *
 * - the draw() method 
 *   - multiplies the model-view matrix passed as an argument 
 *     with its own model-view matrix from the right
 *   - for each drawable object:
 *     - activate the program to be used
 *       (either the node's own program, or if that is not
 *       defined, the program passed as an argument)
 *     - set the uniform "modelViewMAtrix" in the active program
 *     - call the object's draw() method using the current
 *       program and matrix
 *
*/


/* requireJS module definition */
define(["util", "gl-matrix"], 
       (function(util, dummy) {

    "use strict";
    
    /* 
     * SceneNode constructor
     * A SceneNode holds a collection of things to be drawn, 
     * plus an associated transformation and program (both optional).
     *
     * The constructor takes the following arguments:
     * - name      : string defining the name of the SceneNode for UI/debugging purposes,
     * - objects   : array of objects to be contained in this SceneNode 
     * - program   : a Program object (see program.js)
     * - transform : local transformation matrix (of type mat4, see ../lib/gl-matrix.js)
     *  
     */ 
    var SceneNode = function(name, objects, program, transform) {
    
        // name for UI / debugging
        this.name = name;
        
        // optional list of objects contained in this node
        this.drawableObjects = objects || [];
        
        // optional GPU program for this node
        this.program         = program || null;

        // optional transformation for this node
        this.transformation  = transform || mat4.identity();
        
        window.console.log("created node " + this.name + " with " + this.drawableObjects.length + " object(s).");
        
    };
    
    
    /*
     * draw() simply calls the draw() method of each object,
     * in the order they were added to the SceneNode. Before that,
     * the SceneNode node's own model-view matrix is multiplied  
     * with the model-view matrix passed as an argument,
     * and the shader variable "modelViewMatrix" is set.
     * - gl              : the WebGL rendering context 
     * - progam          : the (WebGL) Program to be used
     * - modelViewMatrix : the current modelview matrix 
     */
    SceneNode.prototype.draw = function(gl, program, modelViewMatrix) {
    
        // window.console.log("drawing " + this.name);

        if(!gl) {
            throw "no WebGL context available in scene node " + this.name;
            return;
        };
    
        // take program passed as a parameter, or the program from the constructor
        var newProgram = this.program || program;
        if(!newProgram) {
            throw "no program available in scene node " + this.name;
            return;
        };
            
        // copy  the matrix passed as a parameter, or identity if undefined
        var newMatrix = mat4.create(modelViewMatrix || mat4.identity());
        
        // multiply the local transformation from the right so it will be executed FIRST
        mat4.multiply(newMatrix, this.transformation);  

        // loop over all drawable objects and call their draw() methods
        for(var i=0; i<this.drawableObjects.length; ++i) {
            // set new program and new model view matrix for each child
            newProgram.use();
            newProgram.setUniform("modelViewMatrix", "mat4", newMatrix);
            // child may manipulate the program and/or matrix!
            this.drawableObjects[i].draw(gl, newProgram, newMatrix);
        };
        
    };
    
    /* 
     * add multiple objects to the SceneNode, in drawing order
     * - objects: ARRAY of objects to be added
     */
    SceneNode.prototype.addObjects = function(objects) {

        for(var i=0; i<objects.length; i++) {
            var o = objects[i];
            if(!o.draw) {
                throw "addObjects(): object " + i + " has no draw() method.";
            } else {
                this.drawableObjects.push(o);
            }
            
        };
        window.console.log("added " + objects.length + " objects to SceneNode " + this.name + ".");
            
    };
    
    /*
     * remove drawable objects from the SceneNode (provided in an array)
     */
    SceneNode.prototype.removeObjects = function(objects) {

        for(var i=0; i<objects.length; i++) {
            // find obj in array
            var idx = this.drawableObjects.indexOf(objects[i]); 
            if(idx === -1) {
                window.console.log("warning: SceneNode.remove(): object not found.");
            } else {
                // remove obj from array
                this.drawableObjects.splice(idx,1);
            };
        };
            
    };
    
    // this module only exports the constructor for SceneNode objects
    return SceneNode;

})); // define

    
