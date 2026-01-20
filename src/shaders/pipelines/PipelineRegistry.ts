import { anisotropicKuwaharaPipeline } from "./anisotropicKuwahara";
import type {PipelineId} from "./PipelineId.ts";
import type {Pipeline} from "./Pipeline.ts";
import {testPipeline} from "./testPipeline.ts";

export const PIPELINES: Record<PipelineId, Pipeline> = {
    anisotropicKuwahara: anisotropicKuwaharaPipeline,
    test: testPipeline,
};

export const PIPELINE_LIST = Object.values(PIPELINES);
