import type {PipelineId} from "./PipelineId.ts";
import type {Pipeline} from "./Pipeline.ts";
import { anisotropicKuwaharaPipeline } from "./anisotropicKuwahara";
import {kaleidoscopePipeline} from "./kaleidoscope.ts";
import {ryuukishiPipeline} from "./ryuukishi.ts";

export const PIPELINES: Record<PipelineId, Pipeline> = {
    ryuukishi: ryuukishiPipeline,
    anisotropicKuwahara: anisotropicKuwaharaPipeline,
    kaleidoscope: kaleidoscopePipeline,
};

export const PIPELINE_LIST = Object.values(PIPELINES);
