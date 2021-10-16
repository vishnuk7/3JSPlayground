uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vColor;

// #include ../noise/simplex/3d.glsl;
// #include ../noise/classic/3d.glsl;
#include ../noise/smoke/3d.glsl;

void main(){

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //varying
    vUv = uv;
}
