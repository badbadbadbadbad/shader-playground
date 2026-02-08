uniform sampler2D tDiffuse;
uniform float levels;

in vec2 vUv;
out vec4 outColor;

void main() {
    vec3 color = texture(tDiffuse, vUv).rgb;
    vec3 quantized = floor(color * (levels - 1.0) + 0.5) / (levels - 1.0);

    outColor = vec4(clamp(quantized, 0.0, 1.0), 1.0);
}
