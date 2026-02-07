import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import sharpenFrag from "./sharpen.frag";

export const sharpenEffect: Effect = {
    id: EFFECT_IDS.SHARPEN,
    label: "Sharpen",
    vertex: fullscreenVert,
    fragment: sharpenFrag,
    uniforms: {
        tDiffuse: { value: null },
        kernelSize: { value: 1.0 },
        strength: { value: 1.0 },
    },
    buildGui: (gui, uniform, onChange) => {
        gui.add(uniform.kernelSize, "value", 0.2, 4.0, 0.1).name("Kernel size").onChange(onChange);
        gui.add(uniform.strength, "value", 0.0, 3.0, 0.05).name("Strength").onChange(onChange);
    },
};
