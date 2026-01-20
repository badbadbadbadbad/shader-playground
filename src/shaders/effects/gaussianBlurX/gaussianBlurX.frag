#define PI 3.14159265358979323846

uniform sampler2D tDiffuse;
uniform vec2 resolution;

in vec2 vUv;

out vec4 outColor;

float gaussian(float sigma, float xOffset) {
    return (1. / sigma * sqrt(2. * PI)) * exp(-(xOffset * xOffset) / (2. * sigma * sigma));
}

void main() {
    vec2 texelSize = vec2(1. / resolution.x, 1. / resolution.y);

    int kernelRadius = 5;
    float kernelSum = 0.;

    for (int xOffset = -kernelRadius; xOffset <= kernelRadius; xOffset++) {
        vec4 color = texture2D(tDiffuse, vUv + vec2(float(xOffset) * texelSize.x, 0));
        float gauss = gaussian(2., float(xOffset));

        outColor += color;
        kernelSum += gauss;
    }

    outColor = vec4(outColor.rgb / kernelSum, 1.);
}