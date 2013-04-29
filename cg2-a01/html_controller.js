/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */
 
/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve"], 
       (function($, StraightLine, Circle, ParametricCurve) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {
    
		/*
		 * defines function for selection events
		 */
		sceneController.onSelection((function() {
			var curobject = sceneController.getSelectedObject();
			$("#inputColor").val(curobject.lineStyle.color);
			$("#inputLineWidth").val(curobject.lineStyle.width);
			if(curobject instanceof Circle) {
			$("#formRadius").show();
			$("#inputRadius").val(curobject.radius);
			} else $("#formRadius").hide();
		}));
    
        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };
            
        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };
		
		/*
		* event handler for accept button
		*/
		$("#btnAccept").click((function() {
			var curobject = sceneController.getSelectedObject();
			var color = $("#inputColor").val();
			var width = parseInt($("#inputLineWidth").val(),10);
			if(color != undefined) {
				curobject.lineStyle.color = color;
			}
			if(width != undefined && width == width) {
				curobject.lineStyle.width = width;
			}
			if(curobject instanceof Circle) {
				var radius = parseInt($("#inputRadius").val());
				if(radius != undefined && radius == radius) curobject.radius = radius;
			}
			sceneController.changeCallback();
		}));
		
		$("#btnNewCurve").click((function() {
			var _xt = $("#inputXt").val();
			var _yt = $("#inputYt").val();
			if(evalExpr(_xt)) {
				if(evalExpr(_yt)) {
					var style = { 
					width: Math.floor(Math.random()*3)+1,
					color: randomColor()
					};
					var curve = new ParametricCurve(style,_xt,_yt,
					$("#inputMint").val(), $("#inputMaxt").val(), $("#inputSegments").val(),
					$("#inputTickmarks").checked=="checked");
					scene.addObjects([curve]);
					sceneController.deselect();
					sceneController.select(curve);
				} else failExpr(_yt);
			} else failExpr(_xt);
		}));
		
		/* function to evaluate entering of x(t) and y(t) functions */
		var evalExpr = function(expr) {
			if(expr == "") {
				return true;
			}
			var _pattern = /[t+*-\/\d]/;
			if(expr.search(_pattern)== -1) {
				return false;
			}
			return true;
		};
		/* function for output formula errors */
		var failExpr = function(expr) {
			alert("Function not provided:\n"+expr);
		};
		/*
		 * defines function for object changes
		 */
		 sceneController.onObjChange((function() {
			sceneController.select(sceneController.getSelectedObject());
		 }));
		
        /* 
		 *event handler for "new circle button". 
		 */
		$("#btnNewCircle").click( (function() {
			//create the circle and add it to scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
			var ci = new Circle([randomX(),randomY()],Math.random()*30+50,style);
			scene.addObjects([ci]);
			// deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(ci); // this will also redraw
		}));
		
        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
                        
        }));
        
    
    };
	// initial state for input elements
	$("#inputLineWidth").val("");
	$("#inputColor").val("");
	$("#inputRadius").val("");
	$("#inputXt").val("");
	$("#inputYt").val("");
	$("#inputMint").val("");
	$("#inputMaxt").val("");
	$("#inputSegments").val("");
	$("#formRadius").hide();
	/* in case of need
	$("#formParametricCurve").hide();
	*/
	
    // return the constructor function 
    return HtmlController;


})); // require 



            
