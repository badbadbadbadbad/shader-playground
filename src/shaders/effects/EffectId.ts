export const EFFECT_IDS = {
    GAMMA: "gamma",
    STRUCTURE_TENSOR: "structure-tensor",
    GAUSSIAN_BLUR_X: "gaussian-blur-x",
    GAUSSIAN_BLUR_Y: "gaussian-blur-y",
    ANISOTROPIC_KUWAHARA: "anisotropic-kuwahara",
    RADIAL_CHROMATIC_ABERRATION: "radial-chromatic-aberration",
    RADIAL_BLUR: "radial-blur",
    ZOOM_BLUR: "zoom-blur",
    VIGNETTE: "vignette",
    LEVEL: "level",
    SHARPEN: "sharpen",
} as const;

export type EffectId = typeof EFFECT_IDS[keyof typeof EFFECT_IDS];
