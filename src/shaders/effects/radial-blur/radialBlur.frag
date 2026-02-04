uniform sampler2D tDiffuse;

uniform float radialBlurStrength;
uniform float radialBlurSize;

in vec2 vUv;
out vec4 outColor;

const int SAMPLES = 30;

void main() {
    vec2 uv = vUv;
    vec2 centerUv = vec2(0.5, 0.5);

    if (radialBlurStrength < 0.01 || radialBlurSize < 0.01) {
        outColor = texture(tDiffuse, uv);
        return;
    }

    vec2 deltaFromCenter = uv - centerUv;
    float distanceFromCenter = length(deltaFromCenter);
    float scaledDistance = distanceFromCenter / (2.0 - radialBlurSize);

    float radialMask = smoothstep(0.0, 1.0, scaledDistance);
    float blurStrength = radialMask * radialBlurStrength;

    if (blurStrength < 0.01) {
        outColor = texture(tDiffuse, uv);
        return;
    }

    float baseAngle = atan(deltaFromCenter.y, deltaFromCenter.x);
    float blurSamples = clamp(blurStrength * 20.0, 1.0, float(SAMPLES));

    float totalAngleSpread = blurStrength * 0.1;
    float angleStep = totalAngleSpread / blurSamples;
    float startAngle = baseAngle - (totalAngleSpread * 0.5);

    vec3 colorSum = vec3(0.0);
    float totalWeight = 0.0;

    for (int i = 0; i < SAMPLES; i++) {
        float j = float(i) / blurSamples;
        float sampleAngle = startAngle + (float(i) * angleStep);

        vec2 sampleDirection = vec2(cos(sampleAngle), sin(sampleAngle));
        vec2 sampleUv = centerUv + sampleDirection * distanceFromCenter;

        float centeredT = j - 0.5;
        float weight = exp(-2.0 * centeredT * centeredT);

        colorSum += texture(tDiffuse, sampleUv).rgb * weight;
        totalWeight += weight;
    }

    vec3 blurredColor = colorSum / totalWeight;
    outColor = vec4(blurredColor, 1.0);
}
