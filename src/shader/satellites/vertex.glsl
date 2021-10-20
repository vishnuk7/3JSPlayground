uniform float uProgress;
uniform float uTime;
uniform float uSize;

varying vec3 vColor;
varying vec2 vUv;

void main() {
    vec3 p = position;

    p.y += 5. * cos(abs(abs(sin(p.y * 1000. + uTime * .5)) - 0.5 * uTime * 2.)) - 0.5;
    // p.z += 1. * sin(abs(cos(sin(p.y*1000. + uTime*.5)) - 0.5 * uTime * 2.)) - 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    //varying
    vUv = uv;
}
