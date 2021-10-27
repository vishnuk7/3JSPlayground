uniform float uTime;

void main() {
    vec3 p = position;

    p.z += 10.0 * sin(p.z * uTime);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    vec4 viewPosition = viewMatrix * mvPosition;

    gl_PointSize = 1000.0;
    gl_PointSize *= (1.0 / -viewPosition.z);

    gl_Position = projectionMatrix * mvPosition;
}
