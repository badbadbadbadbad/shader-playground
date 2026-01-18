import type { GUI } from "lil-gui";

export type EffectDefinition = {
    id: string;
    name: string;
    vertex: string;
    fragment: string;
    uniforms: Record<string, { value: any }>;
    buildGui?: (gui: GUI, uniforms: any, onChange: () => void) => void;
};
