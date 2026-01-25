export const PIPELINE_IDS = {
    ANISOTROPIC_KUWAHARA: "anisotropicKuwahara",
    LENS_SWIRL: "lensSwirl",
} as const;

export type PipelineId = typeof PIPELINE_IDS[keyof typeof PIPELINE_IDS];