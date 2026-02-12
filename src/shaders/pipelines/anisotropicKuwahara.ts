import type { Pipeline } from "./Pipeline.ts";
import { gammaEffect } from "../effects/gamma/gamma.ts";
import {PIPELINE_IDS} from "./PipelineId.ts";
import {structureTensorEffect} from "../effects/structure-tensor/structureTensor.ts";
import {gaussianBlurXEffect} from "../effects/gaussian-blur-x/gaussianBlurX.ts";
import {gaussianBlurYEffect} from "../effects/gaussian-blur-y/gaussianBlurY.ts";
import {anisotropicKuwaharaEffect} from "../effects/anisotropic-kuwahara/anisotropicKuwahara.ts";

export const anisotropicKuwaharaPipeline: Pipeline = {
    id: PIPELINE_IDS.ANISOTROPIC_KUWAHARA,
    label: "Kuwahara",
    effects: [
        structureTensorEffect,
        gaussianBlurXEffect,
        gaussianBlurYEffect,
        anisotropicKuwaharaEffect,
        gammaEffect,
    ],
};
