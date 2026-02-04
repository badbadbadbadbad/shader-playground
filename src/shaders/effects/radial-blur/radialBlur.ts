import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import frag from "./radialBlur.frag";

export const radialBlurEffect: Effect = {
    id: EFFECT_IDS.RADIAL_BLUR,
    label: "Radial Blur",
    vertex: fullscreenVert,
    fragment: frag,
    uniforms: {
        tDiffuse: { value: null },
        radialBlurStrength: { value: 0.0 },
        radialBlurSize: { value: 0.0 },
    },
    buildGui: (gui, uniforms, onChange) => {
        gui.add(uniforms.radialBlurStrength, "value", 0.0, 1.5, 0.01).name("Radial blur strength").onChange(onChange);
        gui.add(uniforms.radialBlurSize, "value", 0.0, 1.0, 0.01).name("Radial blur size").onChange(onChange);
    },
};
