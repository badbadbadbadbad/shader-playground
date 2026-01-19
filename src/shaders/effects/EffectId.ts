export const EFFECT_IDS = {
    GAMMA: "gamma",
} as const;

export type EffectId = typeof EFFECT_IDS[keyof typeof EFFECT_IDS];
