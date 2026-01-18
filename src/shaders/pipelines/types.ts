import type { EffectDefinition } from "../types";

export type PipelineId = "anisotropicKuwahara";

export type PipelineDef = {
    id: PipelineId;
    label: string;
    effects: EffectDefinition[];
};
