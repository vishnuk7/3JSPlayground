uniform float uTime;

void main() {
    vec3 p = position;

    p.z += 5.0 * sin(0.1 * p.x * uTime / 5.);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    vec4 viewPosition = viewMatrix * mvPosition;

    gl_PointSize = 2000.0;
    gl_PointSize *= (1.0 / -viewPosition.z);

    gl_Position = projectionMatrix * mvPosition;
}
