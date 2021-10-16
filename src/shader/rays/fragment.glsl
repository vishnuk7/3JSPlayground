uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTxt1;

varying vec2 vUv;


#include ./smoke.glsl;


float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed)
{
	vec2 sourceToCoord = coord - raySource;
	float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);

	return clamp(
		(0.45 + 0.15 * sin(cosAngle * seedA + uTime * speed)) +
		(0.3 + 0.2 * cos(-cosAngle * seedB + uTime * speed)),
		0.0, 1.0) *
		clamp((uResolution.x - length(sourceToCoord)) / uResolution.x, 0.5, 1.0);
}

void main(){
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
	uv.y = 1.0 - uv.y;
	vec2 coord = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);

    // Set the parameters of the sun rays
	vec2 rayPos1 = vec2(uResolution.x * 0.5, uResolution.y * -0.5);
	vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
	float raySeedA1 = 36.2214;
	float raySeedB1 = 21.11349;
	float raySpeed1 = 1.5;

    vec2 rayPos2 = vec2(uResolution.x * 0.6, uResolution.y * -0.6);
	vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
	const float raySeedA2 = 22.39910;
	const float raySeedB2 = 18.0234;
	const float raySpeed2 = 1.1;

    // Calculate the colour of the sun rays on the current fragment
	vec4 rays1 =
		vec4(1.0, 1.0, 1.0, 1.0) *
		rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);

	vec4 rays2 =
		vec4(1.0, 1.0, 1.0, 1.0) *
		rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);


    vec4 fragColor = rays1 * 0.5 + rays2 * 0.4;


    vec2 uv1 = gl_FragCoord.xy / uResolution.xy;
    float n = nestedNoise(uv1 * 6.);

	vec4 smoke = vec4(mix(vec3(.0, .0, .0), vec3(1., 1., 1.), n), 1.);

    // Attenuate brightness towards the bottom, simulating light-loss due to depth.
	// Give the whole thing a blue-green tinge as well.
	float brightness = 1.0 - (coord.y / uResolution.y);
	fragColor.x *= smoke.z * 0.2 + (brightness * 0.1);
	fragColor.y *= 0.1 + (brightness * 0.1);
	fragColor.z *= smoke.x * 0.5 + (brightness * 0.2);;




    gl_FragColor = fragColor;

}
