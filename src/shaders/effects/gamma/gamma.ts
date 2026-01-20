import fullscreenVert from "../fullscreen/fullscreen.vert";
import gammaFrag from "./gamma.frag";
import type { Effect } from "../Effect.ts";
import {EFFECT_IDS} from "../EffectId.ts";

export const gammaEffect: Effect = {
    id: EFFECT_IDS.GAMMA,
    label: "Gamma",
    vertex: fullscreenVert,
    fragment: gammaFrag,
    uniforms: {
        tDiffuse: { value: null },
        gamma: { value: 0.6 },
    },
    buildGui: (gui, uniforms, onChange, effect) => {
        gui.add(uniforms.gamma, "value", 0.3, 2.5, 0.1).name(effect.label).onChange(onChange);
    },
};
