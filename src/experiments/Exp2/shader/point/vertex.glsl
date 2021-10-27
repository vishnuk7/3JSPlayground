void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * mvPosition;

    gl_PointSize = 4000.0;
    gl_PointSize *= (1.0 / -viewPosition.z);

    gl_Position = projectionMatrix * mvPosition;
}
