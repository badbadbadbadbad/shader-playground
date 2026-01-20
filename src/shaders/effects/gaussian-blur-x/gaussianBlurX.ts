import * as THREE from "three";
import type {Effect} from "../Effect.ts";
import {EFFECT_IDS} from "../EffectId.ts";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import gaussianBlurXFrag from "./gaussianBlurX.frag";

export const gaussianBlurXEffect: Effect = {
    id: EFFECT_IDS.GAUSSIAN_BLUR_X,
    label: "Gaussian Blur X-Axis",
    vertex: fullscreenVert,
    fragment: gaussianBlurXFrag,
    uniforms: {
        tDiffuse: { value: null },
        resolution: {value: new THREE.Vector2(1, 1)}
    },
};
