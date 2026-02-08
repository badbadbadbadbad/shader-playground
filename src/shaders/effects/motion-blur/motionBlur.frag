uniform sampler2D tDiffuse;

uniform float sigma;
uniform float angle;
uniform float blendStrength;

in vec2 vUv;
out vec4 outColor;

#define DEG_TO_RAD 0.01745329251994329577

const int SAMPLES = 25;

float degToRad(float degree) { return degree * DEG_TO_RAD; }

void main() {
    vec2 texel = 1.0 / vec2(textureSize(tDiffuse, 0));

    float angleRadians = degToRad(angle);
    vec2 direction = vec2(cos(angleRadians), sin(angleRadians));

    vec2 stepUv = direction * texel * (sigma / float(SAMPLES));

    vec3 colorSum = vec3(0.0);
    float weightSum = 0.0;

    for (int i = 0; i < SAMPLES; i++) {
        float currentSample = (float(i) / float(SAMPLES)) - 0.5;
        float weight = exp(-4.0 * currentSample * currentSample);
        vec2 uv = clamp(vUv + (stepUv * float(i - (SAMPLES / 2))), vec2(0.0), vec2(1.0));
        colorSum += texture(tDiffuse, uv).rgb * weight;
        weightSum += weight;
    }

    vec3 blurred = colorSum / max(weightSum, 0.001);
    vec3 baseColor = texture(tDiffuse, vUv).rgb;
    vec3 outRgb = mix(baseColor, blurred, clamp(blendStrength, 0.0, 1.0));
    outColor = vec4(outRgb, 1.0);
}
