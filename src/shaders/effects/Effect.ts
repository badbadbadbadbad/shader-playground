import type { GUI } from "lil-gui";
import type {EffectId} from "./EffectId.ts";

export type Effect = {
    id: EffectId;
    label: string;
    vertex: string;
    fragment: string;
    uniforms: Record<string, { value: unknown }>;
    buildGui?: (gui: GUI, uniforms: any, onChange: () => void, effect: Effect) => void;
};
