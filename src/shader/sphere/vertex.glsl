uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;

#include ../noise/simplex/3d.glsl;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){

    float noise = snoise(position*.095 + uTime/20.);

    //distorting sphere
    vec3 newPosition = position*0.75 * (noise + 0.5);

    vColor = hsv2rgb(vec3(noise*0.1 + 0.03, 0.8, 0.8));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    //varying
    vUv = uv;
    // vColor = vec3(noise);
    vNormal = normal;
}
