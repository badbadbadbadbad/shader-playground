import * as THREE from "three";
import type {Effect} from "../Effect.ts";
import {EFFECT_IDS} from "../EffectId.ts";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import structureTensorFrag from "../structureTensor/structureTensor.frag";

export const structureTensorEffect: Effect = {
    id: EFFECT_IDS.STRUCTURE_TENSOR,
    label: "Structure Tensor",
    vertex: fullscreenVert,
    fragment: structureTensorFrag,
    uniforms: {
        tDiffuse: { value: null },
        resolution: {value: new THREE.Vector2(1, 1)}
    },
};
