
/*
 * This is main.js which is referenced directly from within
 * a <script> node in index.html
 */

// "use strict" means that some strange JavaScript things are forbidden
"use strict";

// this shall be the function that generates a new phone book object
var makePath = function(separator) {
	var ph = "";
	var sep = "";
	if(separator != undefined) {
		sep = separator;
	}
	var f = function(path) {
		if(ph == "") {
			ph += path;
		}
		else if(path != undefined) {
			ph += sep+path;
		}
		return ph;
	};
	return f;
};

// the main() function is called when the HTML document is loaded
var main = function() {

	// create a path, add a few points on the path, and print it
	var path1 = makePath(',');
	path1("A"); 
	path1("B");
	path1("C");
	window.console.log("path 1 is " + path1() );
	var path2 = makePath();
	path2("X");
	path2("3");
	path2("g");
	window.console.log("path 2 is " + path2() );
};
