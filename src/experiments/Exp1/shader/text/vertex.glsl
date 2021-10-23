#version 300 es

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

attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 p = vec3(position.x, position.y, position.z);

  float frequency1 = 0.035;
  float amplitude1 = 10.0;
  float frequency2 = 0.025;
  float amplitude2 = 20.0;

  // Oscillate vertices up/down
  p.y += (sin(p.x * frequency1 + time) * 0.5 + 0.5) * amplitude1;

  // Oscillate vertices inside/outside
  p.z += (sin(p.x * frequency2 + time) * 0.5 + 0.5) * amplitude2;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
