import * as THREE from "three";
import type {Effect} from "../Effect.ts";
import {EFFECT_IDS} from "../EffectId.ts";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import anisotropicKuwaharaFrag from "./anisotropicKuwahara.frag";

export const anisotropicKuwaharaEffect: Effect = {
    id: EFFECT_IDS.ANISOTROPIC_KUWAHARA,
    label: "Anisotropic Kuwahara",
    vertex: fullscreenVert,
    fragment: anisotropicKuwaharaFrag,
    uniforms: {
        tDiffuse: { value: null },
        inputTex: { value: null },
        resolution: {value: new THREE.Vector2(1, 1)},
        kernelRadius: { value: 3 },
        zetaModifier: { value: 1.0 },
        zeroCrossing: { value: 0.78 },
        sharpness: { value: 8.0 },
    },
    buildGui: (gui, uniforms, onChange) => {
        gui.add(uniforms.kernelRadius, "value", 2, 8, 1).name("Kernel radius").onChange(onChange);
        gui.add(uniforms.zetaModifier, "value", 0.2, 5.0, 0.1).name("Inner blur").onChange(onChange);
        gui.add(uniforms.zeroCrossing, "value", 0.4, 1.0, 0.01).name("Outer blur").onChange(onChange);
        gui.add(uniforms.sharpness, "value", 1.0, 20.0, 1.0).name("Sharpness").onChange(onChange);
    },
};
