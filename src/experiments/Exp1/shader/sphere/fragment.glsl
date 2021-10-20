varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;

void main() {
    //light
    vec3 light = vec3(0.);
    vec3 skyColor = vec3(1.00, 0.86, 0.29);
    vec3 groundColor = vec3(0.50, 0.30, 0.10);

    vec3 lightDirection = normalize(vec3(-0.5, -1.0, -1.0));
    light += dot(lightDirection, vNormal);

    light = mix(skyColor, groundColor, dot(lightDirection, vNormal));

    gl_FragColor = vec4(vUv, 1., 1.);
    gl_FragColor = vec4(light * vColor, 1.);
    // gl_FragColor = vec4(vNormal,1.);

}
