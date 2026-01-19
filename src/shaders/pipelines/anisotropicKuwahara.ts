import type { Pipeline } from "./Pipeline.ts";
import { gammaEffect } from "../effects/gamma/gamma.ts";
import {PIPELINE_IDS} from "./PipelineId.ts";
// later: import structureTensorEffect, gaussXEffect, gaussYEffect, kuwaharaEffect

export const anisotropicKuwaharaPipeline: Pipeline = {
    id: PIPELINE_IDS.ANISOTROPIC_KUWAHARA,
    label: "Anisotropic Kuwahara",
    effects: [
        // structureTensorEffect,
        // gaussXEffect,
        // gaussYEffect,
        // kuwaharaEffect,
        gammaEffect,
    ],
};
