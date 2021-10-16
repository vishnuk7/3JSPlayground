uniform float uProgress;
uniform float uTime;
uniform float uSize;

varying vec3 vColor;
varying vec2 vUv;



void main(){
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = 200. * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    //varying
    vUv = uv;
}
