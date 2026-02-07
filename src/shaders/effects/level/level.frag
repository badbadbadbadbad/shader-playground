uniform sampler2D tDiffuse;

uniform float levelBlack;
uniform float levelWhite;

in vec2 vUv;
out vec4 outColor;

void main() {
    vec3 color = texture(tDiffuse, vUv).rgb;
    vec3 unclampedOut = (color - vec3(levelBlack)) / max(vec3(levelWhite - levelBlack), vec3(0.001));
    outColor = vec4(clamp(unclampedOut, 0.0, 1.0), 1.0);
}
