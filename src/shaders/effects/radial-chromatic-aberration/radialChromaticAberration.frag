uniform sampler2D tDiffuse;
uniform vec2 resolution;

uniform float redScale;
uniform float blueScale;
uniform float blurStrength;

in vec2 vUv;

out vec4 outColor;

vec3 crossBlur(vec2 uv, vec2 offsetUv) {
    vec3 c0 = texture(tDiffuse, uv).rgb;
    vec3 cx1 = texture(tDiffuse, uv + vec2(offsetUv.x, 0.0)).rgb;
    vec3 cx2 = texture(tDiffuse, uv - vec2(offsetUv.x, 0.0)).rgb;
    vec3 cy1 = texture(tDiffuse, uv + vec2(0.0, offsetUv.y)).rgb;
    vec3 cy2 = texture(tDiffuse, uv - vec2(0.0, offsetUv.y)).rgb;
    return (c0 + cx1 + cx2 + cy1 + cy2) / 5.0;
}

void main() {
    vec2 uv = vUv;
    vec2 imageCenterUv = vec2(0.5, 0.5);

    float actualRedScale  = redScale  * 0.05;
    float actualBlueScale = blueScale * 0.05;

    vec2 vectorToCenter = uv - imageCenterUv;
    float distanceToCenter = length(vectorToCenter);

    float distanceFactor = min(distanceToCenter * 2.0, 1.0);
    float distanceFactorSquared = distanceFactor * distanceFactor;
    float redScaleFactor  = 1.0 + distanceFactorSquared * actualRedScale;
    float blueScaleFactor = 1.0 + distanceFactorSquared * actualBlueScale;

    vec2 redUv  = imageCenterUv + vectorToCenter * redScaleFactor;
    vec2 blueUv = imageCenterUv + vectorToCenter * blueScaleFactor;

    vec2 absVectorToNearestCorner = min(uv, vec2(1.0) - uv);
    float edgeFade = smoothstep(0.0, 0.05, min(absVectorToNearestCorner.x, absVectorToNearestCorner.y));
    float edgeFadeSquared = edgeFade * edgeFade;

    redUv  = mix(uv, redUv, edgeFadeSquared);
    blueUv = mix(uv, blueUv, edgeFadeSquared);

    vec2 texelUv = vec2(1.0 / resolution.x, 1.0 / resolution.y);
    vec2 blurOffsetUv = texelUv * blurStrength * distanceFactorSquared;

    vec3 redSample   = crossBlur(redUv, blurOffsetUv);
    vec3 greenSample = crossBlur(uv, blurOffsetUv);
    vec3 blueSample  = crossBlur(blueUv, blurOffsetUv);

    outColor = vec4(redSample.r, greenSample.g, blueSample.b, 1.0);
}