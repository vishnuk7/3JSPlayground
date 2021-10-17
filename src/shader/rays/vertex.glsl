uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying vec3 vColor;
varying float vWave;

#include ../noise/simplex/3d.glsl;
// #include ../noise/classic/3d.glsl;
// #include ../noise/smoke/3d.glsl;

void main(){


    vec3 pos = position;
    float noiseFreq = 0.5;
    float noiseAmp = 1.;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime/5., pos.y, pos.z);
    pos.z += snoise(noisePos) * noiseAmp;
    vWave = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //varying
    vUv = uv;
}
