import type { Pipeline } from "./Pipeline.ts";
import {PIPELINE_IDS} from "./PipelineId.ts";
import {gammaEffect} from "../effects/gamma/gamma.ts";
import {radialChromaticAberrationEffect} from "../effects/radial-chromatic-aberration/radialChromaticAberration.ts";
import {radialBlurEffect} from "../effects/radial-blur/radialBlur.ts";
import {vignetteEffect} from "../effects/vignette/vignette.ts";
import {zoomBlurEffect} from "../effects/zoom-blur/zoomBlur.ts";

export const lensSwirlPipeline: Pipeline = {
    id: PIPELINE_IDS.LENS_SWIRL,
    label: "Lens Swirl",
    effects: [
        radialChromaticAberrationEffect,
        radialBlurEffect,
        zoomBlurEffect,
        vignetteEffect,
        gammaEffect,
    ],
};
