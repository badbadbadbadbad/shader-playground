import type { Pipeline } from "./Pipeline.ts";
import {PIPELINE_IDS} from "./PipelineId.ts";
import {structureTensorEffect} from "../effects/structure-tensor/structureTensor.ts";

export const testPipeline: Pipeline = {
    id: PIPELINE_IDS.TEST,
    label: "Test Pipeline",
    effects: [
        structureTensorEffect,
    ],
};
