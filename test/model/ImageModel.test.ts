import { describe, it, expect, vi } from "vitest";
import { ImageModel } from "../../src/model/ImageModel";

describe("ImageModel", () => {
    it("disposeTexture disposes and clears texture", () => {
        const model = new ImageModel();
        const dispose = vi.fn();

        model.texture = { dispose } as any;

        model.disposeTexture();

        expect(dispose).toHaveBeenCalledTimes(1);
        expect(model.texture).toBeNull();
    });

    it("disposeTexture is safe when texture is null", () => {
        const model = new ImageModel();
        model.texture = null;
        expect(() => model.disposeTexture()).not.toThrow();
    });
});
