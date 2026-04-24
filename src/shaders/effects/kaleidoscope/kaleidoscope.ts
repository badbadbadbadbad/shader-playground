import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import kaleidoscopeFrag from "./kaleidoscope.frag";

export const kaleidoscopeEffect: Effect = {
    id: EFFECT_IDS.KALEIDOSCOPE,
    label: "Kaleidoscope",
    vertex: fullscreenVert,
    fragment: kaleidoscopeFrag,
    uniforms: {
        tDiffuse: { value: null },
        reflections: { value: 5 },
    },
    buildGui: (gui, uniforms, onChange) => {
        gui.add(uniforms.reflections, "value", 2, 20, 1).name("Reflections").onChange(onChange);
    },
};
