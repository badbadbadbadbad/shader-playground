import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import edgeBoostFrag from "./edgeBoost.frag";

export const edgeBoostEffect: Effect = {
    id: EFFECT_IDS.EDGE_BOOST,
    label: "Edge Boost",
    vertex: fullscreenVert,
    fragment: edgeBoostFrag,
    uniforms: {
        tDiffuse: { value: null },
        inputTex: { value: null },
        threshold: { value: 0.25 },
        opacity: { value: 0.50 },
    },
    buildGui: (gui, uniform, onChange) => {
        gui.add(uniform.threshold, "value", 0.0, 1.0, 0.01).name("Edge sensitivity").onChange(onChange);
        gui.add(uniform.opacity, "value", 0.0, 1.0, 0.01).name("Strength").onChange(onChange);
    },
};
