import { describe, it, expect } from "vitest";
import {
    isImage,
    fitRect,
    getImageAspectFromTexture,
} from "../../src/util/imageUtils";

describe("isImage", () => {
    it("accepts valid image types", () => {
        expect(isImage({ type: "image/png" } as File)).toBe(true);
        expect(isImage({ type: "image/jpeg" } as File)).toBe(true);
        expect(isImage({ type: "image/webp" } as File)).toBe(true);
    });

    it("rejects non-image types", () => {
        expect(isImage({ type: "application/pdf" } as File)).toBe(false);
        expect(isImage({ type: "" } as File)).toBe(false);
    });
});

describe("fitRect", () => {
    it("fits wide image into square container", () => {
        const { w, h } = fitRect(100, 100, 2);
        expect(w).toBe(100);
        expect(h).toBe(50);
    });

    it("fits tall image into square container", () => {
        const { w, h } = fitRect(100, 100, 0.5);
        expect(w).toBe(50);
        expect(h).toBe(100);
    });
});

describe("getImageAspectFromTexture", () => {
    it("returns correct aspect when width/height exist", () => {
        const tex = { image: { width: 200, height: 100 } } as any;
        expect(getImageAspectFromTexture(tex)).toBe(2);
    });

    it("returns 1 for invalid/missing dimensions", () => {
        const tex1 = { image: {} } as any;
        const tex2 = { image: { width: 100, height: 0 } } as any;
        const tex3 = { image: null } as any;

        expect(getImageAspectFromTexture(tex1)).toBe(1);
        expect(getImageAspectFromTexture(tex2)).toBe(1);
        expect(getImageAspectFromTexture(tex3)).toBe(1);
    });
});
