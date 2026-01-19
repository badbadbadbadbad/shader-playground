import { anisotropicKuwaharaPipeline } from "./anisotropicKuwahara";
import type {PipelineId} from "./PipelineId.ts";
import type {Pipeline} from "./Pipeline.ts";

export const PIPELINES: Record<PipelineId, Pipeline> = {
    anisotropicKuwahara: anisotropicKuwaharaPipeline,
};

export const PIPELINE_LIST = Object.values(PIPELINES);
