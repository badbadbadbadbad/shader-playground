import type { PipelineDef, PipelineId } from "./types";
import { anisotropicKuwaharaPipeline } from "./anisotropicKuwahara";

export const PIPELINES: Record<PipelineId, PipelineDef> = {
    anisotropicKuwahara: anisotropicKuwaharaPipeline,
};

export const PIPELINE_LIST = Object.values(PIPELINES);
