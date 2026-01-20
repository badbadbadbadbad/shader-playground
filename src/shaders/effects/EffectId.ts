export const EFFECT_IDS = {
    GAMMA: "gamma",
    STRUCTURE_TENSOR: "structureTensor",
    GAUSSIAN_BLUR_X: "gaussianBlurX",
    GAUSSIAN_BLUR_Y: "gaussianBlurY",
} as const;

export type EffectId = typeof EFFECT_IDS[keyof typeof EFFECT_IDS];
