uniform sampler2D tDiffuse;
uniform vec2 resolution;

uniform float redScale;
uniform float blueScale;
uniform float blurStrength;

in vec2 vUv;

out vec4 outColor;

vec3 sample3Tap(vec2 uv, vec2 offsetUv) {
    vec3 c0 = texture(tDiffuse, uv).rgb;
    vec3 c1 = texture(tDiffuse, uv + offsetUv).rgb;
    vec3 c2 = texture(tDiffuse, uv - offsetUv).rgb;
    return (c0 + c1 + c2) / 3.0;
}

void main() {
    vec2 uv = vUv;
    vec2 imageCenterUv = vec2(0.5, 0.5);

    float actualRedScale  = redScale  * 0.05;
    float actualBlueScale = blueScale * 0.05;

    vec2 fromCenter = uv - imageCenterUv;
    float distanceFromCenter = length(fromCenter);

    float edgeFactor = min(distanceFromCenter * 2.0, 1.0);
    float chromaticFactor = edgeFactor * edgeFactor;

    float redScaleFactor  = 1.0 + chromaticFactor * actualRedScale;
    float blueScaleFactor = 1.0 + chromaticFactor * actualBlueScale;

    vec2 redUv  = imageCenterUv + fromCenter * redScaleFactor;
    vec2 blueUv = imageCenterUv + fromCenter * blueScaleFactor;

    vec2 distanceToEdge = min(uv, vec2(1.0) - uv);
    float edgeFade = smoothstep(0.0, 0.05, min(distanceToEdge.x, distanceToEdge.y));
    float fade = edgeFade * edgeFade;

    redUv  = mix(uv, redUv, fade);
    blueUv = mix(uv, blueUv, fade);

    float blurPixels = blurStrength * chromaticFactor;

    vec2 texelUv = vec2(1.0 / resolution.x, 1.0 / resolution.y);
    vec2 blurOffsetUv = texelUv * blurPixels;

    vec2 blurOffsetX = vec2(blurOffsetUv.x, 0.0);

    vec3 redSample   = sample3Tap(redUv,  blurOffsetX);
    vec3 greenSample = sample3Tap(uv,     blurOffsetX);
    vec3 blueSample  = sample3Tap(blueUv, blurOffsetX);

    float red   = redSample.r;
    float green = greenSample.g;
    float blue  = blueSample.b;

    outColor = vec4(red, green, blue, 1.0);
}