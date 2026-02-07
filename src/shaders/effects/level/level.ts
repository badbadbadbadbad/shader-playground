import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import levelFrag from "./level.frag";

export const levelEffect: Effect = {
    id: EFFECT_IDS.LEVEL,
    label: "Levels",
    vertex: fullscreenVert,
    fragment: levelFrag,
    uniforms: {
        tDiffuse: { value: null },
        levelBlack: { value: 0.20 },
        levelWhite: { value: 0.80 },
    },
    buildGui: (gui, uniform, onChange) => {
        gui.add(uniform.levelBlack, "value", 0.0, 1.0, 0.01).name("Black").onChange(onChange);
        gui.add(uniform.levelWhite, "value", 0.0, 1.0, 0.01).name("White").onChange(onChange);
    },
};
