import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import posterizeFrag from "./posterize.frag";

export const posterizeEffect: Effect = {
    id: EFFECT_IDS.POSTERIZE,
    label: "Posterization",
    vertex: fullscreenVert,
    fragment: posterizeFrag,
    uniforms: {
        tDiffuse: { value: null },
        levels: { value: 9.0 },
    },
    buildGui: (gui, uniform, onChange) => {
        gui.add(uniform.levels, "value", 2.0, 32.0, 1.0).name("Levels").onChange(onChange);
    },
};
