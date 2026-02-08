uniform sampler2D tDiffuse;
uniform sampler2D inputTex;

uniform float threshold;
uniform float opacity;

in vec2 vUv;
out vec4 outColor;

// Using Rec. 709 values for conversion
#define RGB_TO_LUMINANCE vec3(0.2126, 0.7152, 0.0722)

float rgbToLuminance(vec3 color) { return dot(color, RGB_TO_LUMINANCE); }

void main() {
    vec2 texel = 1.0 / vec2(textureSize(inputTex, 0));

    float topLeft = rgbToLuminance(texture(inputTex, vUv + texel * vec2(-1.0, -1.0)).rgb);
    float top = rgbToLuminance(texture(inputTex, vUv + texel * vec2(0.0, -1.0)).rgb);
    float topRight = rgbToLuminance(texture(inputTex, vUv + texel * vec2(1.0, -1.0)).rgb);

    float left = rgbToLuminance(texture(inputTex, vUv + texel * vec2(-1.0, 0.0)).rgb);
    float right = rgbToLuminance(texture(inputTex, vUv + texel * vec2(1.0, 0.0)).rgb);

    float bottomLeft = rgbToLuminance(texture(inputTex, vUv + texel * vec2(-1.0, 1.0)).rgb);
    float bottom = rgbToLuminance(texture(inputTex, vUv + texel * vec2(0.0, 1.0)).rgb);
    float bottomRight = rgbToLuminance(texture(inputTex, vUv + texel * vec2(1.0, 1.0)).rgb);

    float sobelX = (-1.0 * topLeft) + (1.0 * topRight) + (-2.0 * left) + (2.0 * right) + (-1.0 * bottomLeft) + (1.0 * bottomRight);
    float sobelY = (-1.0 * topLeft) + (-2.0 * top) + (-1.0 * topRight) + (1.0 * bottomLeft) + (2.0 * bottom) + (1.0 * bottomRight);

    float edgeStrength = clamp(length(vec2(sobelX, sobelY)), 0.0, 1.0);
    float invertedEdgeStrength = 1.0 - edgeStrength;
    float edgeMask = step(threshold, invertedEdgeStrength);

    vec3 baseColor = texture(tDiffuse, vUv).rgb;
    vec3 maskColor = baseColor * vec3(edgeMask);
    vec3 outRgb = mix(baseColor, maskColor, opacity);

    outColor = vec4(outRgb, 1.0);
}
