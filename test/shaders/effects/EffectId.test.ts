import { describe, it, expect } from "vitest";
import { EFFECT_IDS } from "../../../src/shaders/effects/EffectId";

describe("EffectId", () => {
    it("EFFECT_IDS values are unique", () => {
        const effectIdValues = Object.values(EFFECT_IDS);
        const uniqueEffectIdValues = Array.from(new Set(effectIdValues));
        expect(uniqueEffectIdValues.length).toBe(effectIdValues.length);
    });
});
