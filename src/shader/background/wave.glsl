

// Original copy was lost. Sorry.

vec2 xform(in vec2 pt, in float w0) {
    return vec2(snoise(vec4(pt, 0.0, w0)),
                snoise(vec4(pt, 0.0, w0 + 1000.0)));
}

vec4 wave(vec4 fragColor, vec4 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord.xy / uResolution.xy;

    vec2 pt = vec2(uv.x*3.0, uv.y*6.0);
    pt += 0.5*xform(pt*0.5, uTime/5.1);
    pt += 0.3*xform(vec2(pt.x*3.1, pt.y*1.5), uTime/3.1);
    pt += 0.2*xform(pt*4.1, uTime/1.3);
    pt += 0.1*xform(pt*6.2, uTime*3.0);

    // Time varying pixel color
    //vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    float gray = (snoise(vec4(pt, uTime/7.0, uTime/uResolution.x)) + 1.0)/2.0;

    // Output to screen
    vec4 color = vec4(gray,gray,gray,1.0);

    return color;
}
