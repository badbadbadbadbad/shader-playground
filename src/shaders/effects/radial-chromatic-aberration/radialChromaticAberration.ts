import * as THREE from "three";
import type {Effect} from "../Effect.ts";
import {EFFECT_IDS} from "../EffectId.ts";
import fullscreenVert from "../fullscreen/fullscreen.vert";
import radialChromaticAberrationFrag from "./radialChromaticAberration.frag";

export const radialChromaticAberrationEffect: Effect = {
    id: EFFECT_IDS.RADIAL_CHROMATIC_ABERRATION,
    label: "Chromatic Aberration",
    vertex: fullscreenVert,
    fragment: radialChromaticAberrationFrag,
    uniforms: {
        tDiffuse: { value: null },
        resolution: {value: new THREE.Vector2(1, 1)},
        redScale: { value: 0.0 },
        blueScale: { value: 0.0 },
    },
    buildGui: (gui, uniforms, onChange) => {
        gui.add(uniforms.redScale, "value", -1.0, 1.0, 0.01).name("Red aberration").onChange(onChange);
        gui.add(uniforms.blueScale, "value", -1.0, 1.0, 0.01).name("Blue aberration").onChange(onChange);
    },
};
