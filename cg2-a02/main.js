/*
  *
 * Module main: CG2 Aufgabe 2 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* 
 *  RequireJS alias/path configuration (http://requirejs.org/)
 */

requirejs.config({
    paths: {
    
        // jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],
            
        // gl-matrix library
        "gl-matrix": "../lib/gl-matrix-1.3.7"

    }
});


/*
 * The function defined below is the "main" module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "gl-matrix", "util", "scene", "animation", "html_controller"], 
       (function($, glmatrix, util, Scene, Animation, HtmlController ) {

    "use strict";
    
    $(document).ready( (function() {
    
        // create WebGL context object for the named canvas object
        var gl = util.makeWebGLContext("drawing_area");
                                        
        // create scene, create animation, and draw once
        var scene = new Scene(gl);
        var animation = makeAnimation(scene);
        scene.draw();        

        // create HtmlController that takes care of all interaction
        // of HTML elements with the scene and the animation
        var controller = new HtmlController(scene,animation); 
        
    })); // $(document).ready()

    /*
     * create an animation that rotates the scene around 
     * the Y axis over time. 
     */
    var makeAnimation = function(scene) {
    
        // create animation to rotate the scene
        var animation = new Animation( (function(t, deltaT) {

            // rotate by 25° around the X axis to get a tilted perspective
            var matrix = mat4.create(scene.cameraTransformation);
            
            // rotation around Y axis, depending on animation time
            var angle = t/1000 * animation.customSpeed / 180*Math.PI; // 10 deg/sec, in radians
            mat4.rotate(matrix, angle, [0,1,0]);
            
            // set the scene's transformation to what we have calculated
            scene.transformation = matrix;
            
            // (re-) draw the scene
            scene.draw();
            
        } )); // end animation callback

        // set an additional attribute that can be controlled from the outside
        animation.customSpeed = 20; 

        return animation;
    
    };

    
    
})); // define module
        

