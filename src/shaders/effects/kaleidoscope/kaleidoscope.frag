uniform sampler2D tDiffuse;

uniform int reflections;

in vec2 vUv;
out vec4 outColor;

vec2 mirrorUv(vec2 uv)
{
    vec2 wrappedUv = mod(uv, 2.0);
    return mix(wrappedUv, 2.0 - wrappedUv, step(1.0, wrappedUv));
}

void main()
{
    vec2 uv = vUv;
    vec2 centerUv = vec2(0.5, 0.5);

    vec2 deltaFromCenter = uv - centerUv;

    float distanceFromCenter = length(deltaFromCenter);
    float baseAngle = atan(deltaFromCenter.y, deltaFromCenter.x);

    float fullRotation = 6.28318530718;
    float sectorAngle = fullRotation / float(reflections);

    float foldedAngle = mod(baseAngle, sectorAngle);
    foldedAngle = abs(foldedAngle - sectorAngle * 0.5);

    vec2 direction = vec2(cos(foldedAngle), sin(foldedAngle));
    vec2 kaleidoscopeUv = centerUv + direction * distanceFromCenter;

    vec2 mirroredUv = mirrorUv(kaleidoscopeUv);

    outColor = texture(tDiffuse, mirroredUv);
}