uniform sampler2D uTexture;

void mainUv(inout vec2 uv) {
  vec4 tex = texture2D(uTexture, uv);
		// Convert normalized values into regular unit vector
  float vx = -(tex.r * 2. - 1.);
  float vy = -(tex.g * 2. - 1.);
		// Normalized intensity works just fine for intensity
  float intensity = tex.b;
  float maxAmplitude = 0.2;
  uv.x += vx * intensity * maxAmplitude;
  uv.y += vy * intensity * maxAmplitude;
}
