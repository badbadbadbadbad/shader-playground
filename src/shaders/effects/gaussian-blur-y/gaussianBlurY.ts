import * as THREE from "three";
import type {Effect} from "../Effect.ts";
import {EFFECT_IDS} from "../EffectId.ts";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import gaussianBlurYFrag from "./gaussianBlurY.frag";

export const gaussianBlurYEffect: Effect = {
    id: EFFECT_IDS.GAUSSIAN_BLUR_Y,
    label: "Gaussian Blur Y-Axis",
    vertex: fullscreenVert,
    fragment: gaussianBlurYFrag,
    uniforms: {
        tDiffuse: { value: null },
        resolution: {value: new THREE.Vector2(1, 1)}
    },
};
