uniform vec3 uMouse;

varying vec2 vUv;
varying vec3 vPosition;


void main(){
    vec3 p = position;


    // coordinate transformation
    vec4 mPosition = modelMatrix * vec4(position, 1.0);

    // vec3 subPosition = uMouse - mPosition.xyz;
    // float force = (10. - clamp(length(subPosition), 0.0, 10.)) / 4.0;
    // mPosition = vec4(mPosition.xyz + force * normalize(-subPosition), 1.0);


    gl_Position = projectionMatrix * viewMatrix * mPosition;
    //varying
    vUv = uv;
    vPosition = position;
}
