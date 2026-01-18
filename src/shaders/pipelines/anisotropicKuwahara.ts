import type { PipelineDef } from "./types";
import { gammaEffect } from "../effects/gamma";
// later: import structureTensorEffect, gaussXEffect, gaussYEffect, kuwaharaEffect

export const anisotropicKuwaharaPipeline: PipelineDef = {
    id: "anisotropicKuwahara",
    label: "Anisotropic Kuwahara",
    effects: [
        // structureTensorEffect,
        // gaussXEffect,
        // gaussYEffect,
        // kuwaharaEffect,
        gammaEffect,
    ],
};
