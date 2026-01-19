export const PIPELINE_IDS = {
    ANISOTROPIC_KUWAHARA: "anisotropicKuwahara",
} as const;

export type PipelineId = typeof PIPELINE_IDS[keyof typeof PIPELINE_IDS];