

void main(){
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;

    vec3 color1 = vec3(0.04,0.04,0.08);
    vec3 color2 = vec3(0.75,0.98,1.00);

    vec3 color = mix(color1, color2, strength);

    gl_FragColor = vec4(color,.8);
}
