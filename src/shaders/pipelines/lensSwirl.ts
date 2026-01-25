import type { Pipeline } from "./Pipeline.ts";
import {PIPELINE_IDS} from "./PipelineId.ts";
import {gammaEffect} from "../effects/gamma/gamma.ts";
import {radialChromaticAberrationEffect} from "../effects/radial-chromatic-aberration/radialChromaticAberration.ts";

export const lensSwirlPipeline: Pipeline = {
    id: PIPELINE_IDS.LENS_SWIRL,
    label: "Lens Swirl",
    effects: [
        radialChromaticAberrationEffect,
        gammaEffect,
    ],
};
