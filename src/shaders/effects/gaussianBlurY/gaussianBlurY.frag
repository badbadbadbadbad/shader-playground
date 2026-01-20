#define PI 3.14159265358979323846

uniform sampler2D tDiffuse;
uniform vec2 resolution;

in vec2 vUv;

out vec4 outColor;

float gaussian(float sigma, float yOffset) {
    return (1. / sigma * sqrt(2. * PI)) * exp(-(yOffset * yOffset) / (2. * sigma * sigma));
}

void main() {
    vec2 texelSize = vec2(1. / resolution.x, 1. / resolution.y);

    int kernelRadius = 5;
    float kernelSum = 0.;

    for (int yOffset = -kernelRadius; yOffset <= kernelRadius; yOffset++) {
        vec4 color = texture2D(tDiffuse, vUv + vec2(0, float(yOffset) * texelSize.y));
        float gauss = gaussian(2., float(yOffset));

        outColor += color;
        kernelSum += gauss;
    }

    outColor = vec4(outColor.rgb / kernelSum, 1.);
}