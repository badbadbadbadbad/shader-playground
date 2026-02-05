import type { Effect } from "../Effect";
import { EFFECT_IDS } from "../EffectId";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import zoomBlurFrag from "./zoomBlur.frag";

export const zoomBlurEffect: Effect = {
    id: EFFECT_IDS.ZOOM_BLUR,
    label: "Zoom Blur",
    vertex: fullscreenVert,
    fragment: zoomBlurFrag,
    uniforms: {
        tDiffuse: { value: null },
        zoomBlurStrength: { value: 0.0 },
        zoomBlurSize: { value: 0.0 },
    },
    buildGui: (gui, uniforms, onChange) => {
        gui.add(uniforms.zoomBlurStrength, "value", 0.0, 1.5, 0.01).name("Zoom blur strength").onChange(onChange);
        gui.add(uniforms.zoomBlurSize, "value", 0.0, 1.0, 0.01).name("Zoom blur size").onChange(onChange);
    },
};
