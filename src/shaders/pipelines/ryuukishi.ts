import type { Pipeline } from "./Pipeline.ts";
import {PIPELINE_IDS} from "./PipelineId.ts";
import {levelEffect} from "../effects/level/level.ts";
import {sharpenEffect} from "../effects/sharpen/sharpen.ts";
import {motionBlurEffect} from "../effects/motion-blur/motionBlur.ts";

export const ryuukishiPipeline: Pipeline = {
    id: PIPELINE_IDS.RYUUKISHI,
    label: "Ryuukishi",
    effects: [
        levelEffect,
        sharpenEffect,
        motionBlurEffect
    ],
};
