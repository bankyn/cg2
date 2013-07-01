/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Fragment Shader: phong
 *
 * expects position and normal vectors in eye coordinates per vertex;
 * expects uniforms for ambient light, directional light, and phong material.
 * 
 *
 */

precision mediump float;

// position and normal in eye coordinates
varying vec4  ecPosition;
varying vec3  ecNormal;
varying vec2 texCoords;

// transformation matrices
uniform mat4  modelViewMatrix;
uniform mat4  projectionMatrix;

// Ambient Light
uniform vec3 ambientLight;

// Material Type
struct PhongMaterial {
    vec3  ambient;
    vec3  diffuse;
    vec3  specular;
    float shininess;
};
// uniform variable for the currently active PhongMaterial
uniform PhongMaterial material;

//texture uniforms
uniform bool Daytime;
uniform bool NightTime;
uniform bool redGreen;
uniform bool glossMap;
uniform bool clouds;
uniform sampler2D daylightTexture;
uniform sampler2D nightTexture;
uniform sampler2D waterEarthTexture;
uniform sampler2D cloudsTexture;

// debugging uniforms
uniform bool debug;
uniform vec3 debugColor;
// red color for water (3.4)
uniform vec3 redColor;

// Light Source Data for a directional light (not point light)
struct LightSource {

    int  type;
    vec3 direction;
    vec3 color;
    bool on;
    
} ;
uniform LightSource light;

/*

 Calculate surface color based on Phong illumination model.
 - pos:  position of point on surface, in eye coordinates
 - n:    surface normal at pos
 - v:    direction pointing towards the viewer, in eye coordinates
 + assuming directional light
 
 */
vec3 phong(vec3 pos, vec3 n, vec3 v, LightSource light, PhongMaterial material) {

    // vector from light to current point
    vec3 l = normalize(light.direction);
    
    // cosine of angle between light and surface normal. 
    float ndotl = dot(n,-l);

    // ambient part, this is a constant term shown on the
    // all sides of the object
    vec3 ambient = material.ambient * ambientLight;
	
	//debug color
	if(debug && (ndotl >= 0.0  && ndotl <= 0.05)) {
		return debugColor;
	}
	
	// check, if water/earth texture, set according red/green color
	if(redGreen){
		vec3 rgCheckColor = texture2D(waterEarthTexture, texCoords.st).rgb;
		//~if water then green else red~
		if (rgCheckColor == vec3(0.0, 0.0, 0.0)){
			return debugColor;
		}
		else return redColor;
	}
	
    // is the current fragment's normal pointing away from the light?
    // then we are on the "back" side of the object, as seen from the light
    if(ndotl <= 0.0) {
        if(!NightTime) {
			return ambient;
		}
		else if(!Daytime){
			return texture2D(nightTexture,texCoords.st).rgb;
		}
	}
	//clouds
	float cloudCoeff = 0.0;
	vec3 cloudColor = texture2D(cloudsTexture, texCoords.st).rgb;
	if(clouds){
		cloudCoeff = cloudColor[1];
	}
	
    // diffuse contribution
    vec3 diffuseCoeff = material.diffuse;
	if(NightTime) {
		ambient = texture2D(nightTexture, texCoords.st).rgb;
		ambient = pow((1.0 - ndotl), 3.0)*ambient;
		//darken colors, if clouds
		ambient *= (1.0-cloudCoeff);
	}
	if(Daytime && NightTime) {
		vec3 day = ((1.0-cloudCoeff) * texture2D(daylightTexture, texCoords.st).rgb + cloudColor*cloudCoeff)/2.0;
		
		if(ndotl < 0.0) {
			return ambient;
		}
		else {
			diffuseCoeff = day;
			//ambient = pow((1.0 - ndotl),4.0)*ambient;
		}
	}
	else if(Daytime){
		diffuseCoeff = texture2D(daylightTexture,texCoords.st).rgb;
	}
    vec3 diffuse = diffuseCoeff * light.color * ndotl;
     // reflected light direction = perfect reflection direction
    vec3 r = reflect(l,n);
    
    // cosine of angle between reflection dir and viewing dir
    float rdotv = max( dot(r,v), 0.0);
	vec3 specularCoeff =  material.specular;
	float shininess = material.shininess;
	

    // gloss map
	if(glossMap){
		vec3 glossColor = texture2D(waterEarthTexture, texCoords.st).rgb;
		specularCoeff = glossColor+0.2;
		//if (glossColor != (0.0, 0.0, 0.0)){
		//	specularCoeff =  material.specular*1.2 ;
		shininess = material.shininess-glossColor[1]*40.0;	
		//}
    }else{
		specularCoeff = material.specular;
		shininess = material.shininess;
	}
	// specular contribution
    vec3 specular = specularCoeff * light.color * pow(rdotv, shininess);

	
 
    // return sum of all contributions
    return ambient + diffuse + specular;
	
}



void main() {
    
    // normalize normal after projection
    vec3 normalEC = normalize(ecNormal);
    
    // do we use a perspective or an orthogonal projection matrix?
    bool usePerspective = projectionMatrix[2][3] != 0.0;
    
    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    vec3 viewdirEC = usePerspective? normalize(-ecPosition.xyz) : vec3(0,0,1);
    
    // calculate color using phong illumination
    vec3 color = phong( ecPosition.xyz, normalEC, viewdirEC,
                        light, material );
    
	// texture coordinates - create stripes (U2.3)
	if(debug){
		if(mod(texCoords.s, 0.05)>= 0.025)
           color = color*0.7;
	}
	
    // set fragment color
	gl_FragColor = vec4(color, 1.0);
}
