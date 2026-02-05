uniform sampler2D tDiffuse;

uniform float zoomBlurStrength;
uniform float zoomBlurSize;

in vec2 vUv;
out vec4 outColor;

const int SAMPLES = 30;

void main() {
    vec2 uv = vUv;
    vec2 centerUv = vec2(0.5, 0.5);

    if (zoomBlurStrength < 0.01 || zoomBlurSize < 0.01) {
        outColor = texture(tDiffuse, uv);
        return;
    }

    vec2 deltaFromCenter = uv - centerUv;
    float distanceFromCenter = length(deltaFromCenter);
    float scaledDistance = distanceFromCenter / (2.0 - zoomBlurSize);

    float radialMask = smoothstep(0.0, 1.0, scaledDistance);
    float blurStrength = radialMask * zoomBlurStrength;

    if (blurStrength < 0.01) {
        outColor = texture(tDiffuse, uv);
        return;
    }

    float blurSamples = clamp(blurStrength * 20.0, 1.0, float(SAMPLES));

    float zoomRange = blurStrength * 0.05;
    float zoomStep = zoomRange / max(blurSamples - 1.0, 1.0);
    float startZoom = 1.0 - (zoomRange * 0.5);

    vec3 colorSum = vec3(0.0);
    float totalWeight = 0.0;

    for (int i = 0; i < SAMPLES; i++) {
        float j = float(i) / blurSamples;

        float zoomFactor = startZoom + (float(i) * zoomStep);
        vec2 sampleUv = centerUv + deltaFromCenter * zoomFactor;

        sampleUv = clamp(sampleUv, vec2(0.0), vec2(1.0));

        float centeredT = j - 0.5;
        float weight = exp(-2.0 * centeredT * centeredT);

        colorSum += texture(tDiffuse, sampleUv).rgb * weight;
        totalWeight += weight;
    }

    vec3 blurredColor = colorSum / totalWeight;
    outColor = vec4(blurredColor, 1.0);
}
