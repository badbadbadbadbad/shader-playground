import type {Effect} from "../Effect.ts";
import {EFFECT_IDS} from "../EffectId.ts";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import vignetteFrag from "./vignette.frag";

export const vignetteEffect: Effect = {
    id: EFFECT_IDS.VIGNETTE,
    label: "Vignette",
    vertex: fullscreenVert,
    fragment: vignetteFrag,
    uniforms: {
        tDiffuse: { value: null },
        vignetteStrength: { value: 0.0 },
        vignetteSize: { value: 0.0 },
    },
    buildGui: (gui, uniforms, onChange) => {
        gui.add(uniforms.vignetteStrength, "value", 0.0, 3.0, 0.05).name("Strength").onChange(onChange);
        gui.add(uniforms.vignetteSize, "value", 0.0, 0.5, 0.01).name("Size").onChange(onChange);
    },
};
