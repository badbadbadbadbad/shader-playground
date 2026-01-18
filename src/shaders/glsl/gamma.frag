uniform sampler2D tDiffuse;
uniform float gamma;

in vec2 vUv;

out vec4 outColor;

void main() {
  vec4 c = texture(tDiffuse, vUv);
  outColor = pow(c, vec4(gamma));
}
