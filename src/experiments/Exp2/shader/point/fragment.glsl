uniform vec2 uResolution;
uniform vec3 uBackgroundColor;
uniform vec3 uForegroundColor;
uniform sampler2D uMap;

void main() {

    vec2 p = gl_FragCoord.xy / uResolution;

    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;
    float circle = strength;
    // vec3 color = mix(uBackgroundColor, uForegroundColor, strength);
    vec4 textureAlpha = texture2D(uMap, gl_PointCoord.xy);
    textureAlpha.rgb = uForegroundColor.rgb;
    gl_FragColor = vec4(uForegroundColor.rgb * textureAlpha.a, textureAlpha.a);
    gl_FragColor = textureAlpha;
}
