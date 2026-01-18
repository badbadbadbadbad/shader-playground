import fullscreenVert from "../glsl/fullscreen.vert";
import gammaFrag from "../glsl/gamma.frag";
import type { EffectDefinition } from "../types";

export const gammaEffect: EffectDefinition = {
    id: "gamma",
    name: "Gamma",
    vertex: fullscreenVert,
    fragment: gammaFrag,
    uniforms: {
        tDiffuse: { value: null },
        gamma: { value: 0.6 },
    },
    buildGui: (gui, uniforms, onChange) => {
        gui.add(uniforms.gamma, "value", 0.3, 2.5, 0.1).name("Gamma").onChange(onChange);
    },
};
