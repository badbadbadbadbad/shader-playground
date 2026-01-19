import type { Effect } from "../effects/Effect.ts";
import type {PipelineId} from "./PipelineId.ts";

export type Pipeline = {
    id: PipelineId;
    label: string;
    effects: Effect[];
};
