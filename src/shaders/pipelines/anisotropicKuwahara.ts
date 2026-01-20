import type { Pipeline } from "./Pipeline.ts";
import { gammaEffect } from "../effects/gamma/gamma.ts";
import {PIPELINE_IDS} from "./PipelineId.ts";
import {structureTensorEffect} from "../effects/structureTensor/structureTensor.ts";
import {gaussianBlurXEffect} from "../effects/gaussianBlurX/gaussianBlurX.ts";
import {gaussianBlurYEffect} from "../effects/gaussianBlurY/gaussianBlurY.ts";
// later: kuwaharaEffect

export const anisotropicKuwaharaPipeline: Pipeline = {
    id: PIPELINE_IDS.ANISOTROPIC_KUWAHARA,
    label: "Anisotropic Kuwahara",
    effects: [
        structureTensorEffect,
        gaussianBlurXEffect,
        gaussianBlurYEffect,
        // kuwaharaEffect,
        gammaEffect,
    ],
};
