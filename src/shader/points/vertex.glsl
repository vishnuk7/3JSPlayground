uniform float uProgress;
uniform float uTime;

varying vec2 vUv;



void main(){
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 500.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    //varying
    vUv = uv;
}
