import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import motionBlurFrag from "./motionBlur.frag";

export const motionBlurEffect: Effect = {
    id: EFFECT_IDS.MOTION_BLUR,
    label: "Motion Blur",
    vertex: fullscreenVert,
    fragment: motionBlurFrag,
    uniforms: {
        tDiffuse: { value: null },
        sigma: { value: 10.0 },
        angle: { value: 155.0 },
        blendStrength: { value: 0.70 },
    },
    buildGui: (gui, uniform, onChange) => {
        gui.add(uniform.sigma, "value", 0.0, 30.0, 0.1).name("Sigma").onChange(onChange);
        gui.add(uniform.angle, "value", 0.0, 180.0, 0.5).name("Angle").onChange(onChange);
        gui.add(uniform.blendStrength, "value", 0.0, 1.0, 0.01).name("Blend strength").onChange(onChange);
    },
};
