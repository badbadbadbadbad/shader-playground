import type {PipelineId} from "./PipelineId.ts";
import type {Pipeline} from "./Pipeline.ts";
import { anisotropicKuwaharaPipeline } from "./anisotropicKuwahara";
import {lensSwirlPipeline} from "./lensSwirl";
import {ryuukishiPipeline} from "./ryuukishi.ts";

export const PIPELINES: Record<PipelineId, Pipeline> = {
    anisotropicKuwahara: anisotropicKuwaharaPipeline,
    lensSwirl: lensSwirlPipeline,
    ryuukishi: ryuukishiPipeline,
};

export const PIPELINE_LIST = Object.values(PIPELINES);
