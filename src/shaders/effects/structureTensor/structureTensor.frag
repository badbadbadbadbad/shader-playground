uniform sampler2D tDiffuse;
uniform vec2 resolution;

in vec2 vUv;

out vec4 outColor;

void main() {
    vec2 texelSize = vec2(1. / resolution.x, 1. / resolution.y);

    vec3 bottomLeft = texture2D(tDiffuse, vUv + vec2(-texelSize.x, -texelSize.y)).rgb;
    vec3 topLeft = texture2D(tDiffuse, vUv + vec2(-texelSize.x, texelSize.y)).rgb;
    vec3 bottomRight = texture2D(tDiffuse, vUv + vec2(texelSize.x, -texelSize.y)).rgb;
    vec3 topRight = texture2D(tDiffuse, vUv + vec2(texelSize.x, texelSize.y)).rgb;

    vec3 Sx = (
    1. * bottomLeft +
    2. * texture2D(tDiffuse, vUv + vec2(-texelSize.x, 0.)).rgb +
    1. * topLeft +
    -1. * bottomRight +
    -2. * texture2D(tDiffuse, vUv + vec2(texelSize.x, 0.)).rgb +
    -1. * topRight
    ) / 4.;

    vec3 Sy = (
    -1. * bottomLeft +
    -2. * texture2D(tDiffuse, vUv + vec2(0., -texelSize.y)).rgb +
    -1. * bottomRight +
    1. * topLeft +
    2. * texture2D(tDiffuse, vUv + vec2(0., texelSize.y)).rgb +
    1. * topRight
    ) / 4.;

    // Structure tensor matrix is (SxSx, SxSy, SxSy, SySy)
    // We only care about the values for further processing, not the order
    outColor = vec4(dot(Sx, Sx), dot(Sy, Sy), dot(Sx, Sy), 1.);
}