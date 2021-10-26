uniform float uAlpha;

varying vec3 vColor;

void main() {
    float alpha = sin(uAlpha + vColor.r * 10. + vColor.b * 20. + vColor.g * 50.);

    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;

    vec3 color1 = vec3(0.04, 0.04, 0.08);
    vec3 color2 = vec3(0.97, 0.94, 0.88);

    vec3 color = mix(color1, color2, strength);

    gl_FragColor = vec4(color, alpha);
}
