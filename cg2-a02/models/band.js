/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (not implemented yet)
     */ 
    var Band = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius   || 1.0;
        var height       = config.height   || 0.1;
        this.segments     = config.segments || 20;
        this.asWireframe = config.asWireframe;
        
        window.console.log("Creating a " + (this.asWireframe? "Wireframe " : "") + 
                            "Band with radius="+radius+", height="+height+", segments="+this.segments ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];
        for(var i=0; i <= this.segments; i++) {
        
            // X and Z coordinates are on a circle around the origin
            var t = (i/this.segments)*Math.PI*2;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 = height/2;
            var y1 = -height/2;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x,y0,z);
            coords.push(x,y1,z);
        };
		// counting pushed indices
		this.indicesCount = 0;
		// wireframe drawing ?
		if(this.asWireframe) {
			var lines = [];
			// build lines
			for(var i=0; i <= this.segments*3; i += 2) {
				lines.push(i, i+1);
				lines.push(i, i+2);
				lines.push(i+1, i+3);
				this.indicesCount += 6;
			}
			lines.push(0,this.segments+2);
			this.indicesCount += 2;
			this.lineBuffer = new vbo.Indices(gl, {"indices" : lines});
		} else {
			var triangles = [];
			// build triangles
			for(var i=0; i <= this.segments*2+this.segments/2; i++) {
				triangles.push(i,i+1,i+2);
				triangles.push(i+2,i+1,i+3);
				this.indicesCount += 6;
			}
			// because last loop irrelevant
			this.indicesCount -= 7;
			this.triangleBuffer = new vbo.Indices(gl, {"indices" : triangles});
		}
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );

    };

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        // draw the vertices as points
        // gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
		if(!this.asWireframe) {
			this.triangleBuffer.bind(gl);
			// gl.drawElements(gl.TRIANGLES, this.coordsBuffer.numVertices()*6-13 ,gl.UNSIGNED_SHORT, 0);
			gl.drawElements(gl.TRIANGLES, this.indicesCount - this.segments*3 ,gl.UNSIGNED_SHORT, 0); 
		} else {
			this.lineBuffer.bind(gl);
			gl.drawElements(gl.LINES, this.indicesCount/2 + this.segments+ this.segments/4 + 1 ,gl.UNSIGNED_SHORT, 0);
		}

    };
        
    // this module only returns the Band constructor function    
    return Band;

})); // define

    
