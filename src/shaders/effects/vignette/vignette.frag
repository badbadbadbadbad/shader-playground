uniform sampler2D tDiffuse;

uniform float vignetteStrength;
uniform float vignetteSize;

in vec2 vUv;
out vec4 outColor;

void main() {
    vec2 uv = vUv;
    vec3 original = texture(tDiffuse, uv).rgb;

    if (vignetteStrength < 0.01 || vignetteSize < 0.01) {
        outColor = vec4(original, 1.0);
        return;
    }

    float distanceToCenter = length(uv - vec2(0.5, 0.5));
    float invertedSize = 1.0 - vignetteSize;
    float scaledDistance = distanceToCenter / invertedSize;

    float vignetteMask = smoothstep(0.0, 1.0, scaledDistance);
    vignetteMask = vignetteMask * vignetteMask * vignetteMask;

    float stopsToMultiplier = pow(2.0, -vignetteStrength);
    float darkenFactor = mix(1.0, stopsToMultiplier, vignetteMask);

    outColor = vec4(original * darkenFactor, 1.0);
}
