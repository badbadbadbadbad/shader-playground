uniform sampler2D tDiffuse;
uniform vec2 resolution;

uniform float redScale;
uniform float blueScale;

in vec2 vUv;
out vec4 outColor;


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

    float redSample = texture(tDiffuse, redUv).r;
    float greenSample = texture(tDiffuse, uv).g;
    float blueSample = texture(tDiffuse, blueUv).b;

    outColor = vec4(redSample, greenSample, blueSample, 1.0);
}