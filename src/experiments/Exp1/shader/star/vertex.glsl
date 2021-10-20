uniform float uTime;

attribute float aScale;

varying vec2 vUv;

void main() {

    vec3 p = position;

    // p.y +=   sin(p.y * uTime);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    vec4 viewPosition = viewMatrix * mvPosition;

    gl_PointSize = 4000. * aScale * (abs(sin(uTime * 0.5)) + 0.5);
    gl_PointSize *= (1.0 / -viewPosition.z);

    gl_Position = projectionMatrix * mvPosition;

    //varying
    vUv = uv;
}
