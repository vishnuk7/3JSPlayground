//@ts-ignore
import assign from 'object-assign';
import * as THREE from 'three';

//@ts-ignore
const createMSDFShader = function createMSDFShader(opt) {
	opt = opt || {};
	var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
	var color = opt.color;
	var map = opt.map;

	// remove to satisfy r73
	delete opt.map;
	delete opt.color;
	delete opt.precision;
	delete opt.opacity;
	delete opt.negate;

	return assign(
		{
			uniforms: {
				opacity: { value: opacity },
				map: { value: map || new THREE.Texture() },
				color: { value: new THREE.Color(color) },
			},
			vertexShader: `#version 300 es
                #define attribute in
                #define varying out
                #define texture2D texture
                precision highp float;
                precision highp int;
                #define HIGH_PRECISION
                #define SHADER_NAME ShaderMaterial
                #define VERTEX_TEXTURES
                #define GAMMA_FACTOR 2
                #define MAX_BONES 0
                #define BONE_TEXTURE

                attribute vec2 uv;
				attribute vec4 position;
				uniform mat4 projectionMatrix;
				uniform mat4 modelViewMatrix;
				varying vec2 vUv;
				void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * position;
				}`,
			fragmentShader: `#version 300 es
                #define varying in
                out highp vec4 pc_fragColor;
                #define gl_FragColor pc_fragColor
                #define gl_FragDepthEXT gl_FragDepth
                #define texture2D texture
                #define textureCube texture
                #define texture2DProj textureProj
                #define texture2DLodEXT textureLod
                #define texture2DProjLodEXT textureProjLod
                #define textureCubeLodEXT textureLod
                #define texture2DGradEXT textureGrad
                #define texture2DProjGradEXT textureProjGrad
                #define textureCubeGradEXT textureGrad
                precision highp float;
                precision highp int;
                #define HIGH_PRECISION
                #define SHADER_NAME ShaderMaterial
                #define GAMMA_FACTOR 2


                #ifdef GL_OES_standard_derivatives
				#extension GL_OES_standard_derivatives : enable
				#endif

				uniform float opacity;
				uniform vec3 color;
				uniform sampler2D map;
				varying vec2 vUv;

				float median(float r, float g, float b) {
				  return max(min(r, g), min(max(r, g), b));
				}

				void main() {
				  vec3 txt =  texture2D(map, vUv).rgb;
				  float sigDist = median(txt.r, txt.g, txt.b) - 0.5;
				  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
				  gl_FragColor = vec4(color.xyz, alpha * opacity);
				  if (gl_FragColor.a <   0.0001 ) discard;
				}`,
		},
		opt
	);
};

export default createMSDFShader;
