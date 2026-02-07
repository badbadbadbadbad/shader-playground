uniform sampler2D tDiffuse;

uniform float kernelSize;
uniform float strength;

in vec2 vUv;
out vec4 outColor;

vec3 blur(vec2 uv, vec2 scaledTexel) {
    vec3 color = vec3(0.0);
    color += texture(tDiffuse, uv + scaledTexel * vec2(-1.0, -1.0)).rgb;
    color += texture(tDiffuse, uv + scaledTexel * vec2( 0.0, -1.0)).rgb;
    color += texture(tDiffuse, uv + scaledTexel * vec2( 1.0, -1.0)).rgb;
    color += texture(tDiffuse, uv + scaledTexel * vec2(-1.0,  0.0)).rgb;
    color += texture(tDiffuse, uv).rgb;
    color += texture(tDiffuse, uv + scaledTexel * vec2( 1.0,  0.0)).rgb;
    color += texture(tDiffuse, uv + scaledTexel * vec2(-1.0,  1.0)).rgb;
    color += texture(tDiffuse, uv + scaledTexel * vec2( 0.0,  1.0)).rgb;
    color += texture(tDiffuse, uv + scaledTexel * vec2( 1.0,  1.0)).rgb;
    return color / 9.0;
}

void main() {
    vec2 texel = 1.0 / vec2(textureSize(tDiffuse, 0));
    vec2 scaledTexel = texel * kernelSize;

    vec3 blurred = blur(vUv, scaledTexel);
    vec3 original = texture(tDiffuse, vUv).rgb;

    vec3 sharp = original + (original - blurred) * strength;
    outColor = vec4(clamp(sharp, 0.0, 1.0), 1.0);
}
