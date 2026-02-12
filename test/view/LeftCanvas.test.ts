import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ImageModel } from "../../src/model/ImageModel";
import { LeftCanvas } from "../../src/view/LeftCanvas";

type FakeVector3 = { set: ReturnType<typeof vi.fn> };
type FakeColor = { set: ReturnType<typeof vi.fn> };

type FakeMaterial = {
    map: any;
    color: FakeColor;
    needsUpdate: boolean;
    dispose: ReturnType<typeof vi.fn>;
};

type FakeGeometry = {
    dispose: ReturnType<typeof vi.fn>;
};

type FakeMesh = {
    geometry: FakeGeometry;
    material: FakeMaterial;
    scale: FakeVector3;
};

type FakeScene = {
    background: any;
    add: ReturnType<typeof vi.fn>;
};

type FakeCamera = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    position: FakeVector3;
    lookAt: ReturnType<typeof vi.fn>;
    updateProjectionMatrix: ReturnType<typeof vi.fn>;
};

type FakeRenderer = {
    domElement: HTMLCanvasElement;
    outputColorSpace: any;
    toneMapping: any;
    setSize: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
};

function createFakeModel(): ImageModel {
    return {
        imageDataUrl: null,
        texture: null,
        imageAspect: 1,
        renderWidth: 100,
        renderHeight: 50,
        disposeTexture: vi.fn(),
    } as any;
}

function createFakeRenderer(): FakeRenderer {
    const canvasElement = document.createElement("canvas");
    return {
        domElement: canvasElement,
        outputColorSpace: undefined,
        toneMapping: undefined,
        setSize: vi.fn(),
        render: vi.fn(),
        dispose: vi.fn(),
    };
}

function createFakeCamera(): FakeCamera {
    return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: { set: vi.fn() },
        lookAt: vi.fn(),
        updateProjectionMatrix: vi.fn(),
    };
}

function createFakeScene(): FakeScene {
    return {
        background: null,
        add: vi.fn(),
    };
}

function createFakeMesh(): FakeMesh {
    return {
        geometry: { dispose: vi.fn() },
        material: {
            map: null,
            color: { set: vi.fn() },
            needsUpdate: false,
            dispose: vi.fn(),
        },
        scale: { set: vi.fn() },
    };
}

describe("LeftCanvas", () => {
    let hostElement: HTMLDivElement;
    let model: ImageModel;

    let fakeScene: FakeScene;
    let fakeCamera: FakeCamera;
    let fakeRenderer: FakeRenderer;
    let fakeMesh: FakeMesh;

    let fileInputElement: HTMLInputElement;
    let fileInputClickSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        hostElement = document.createElement("div");
        model = createFakeModel();

        fakeScene = createFakeScene();
        fakeCamera = createFakeCamera();
        fakeRenderer = createFakeRenderer();
        fakeMesh = createFakeMesh();

        fileInputElement = document.createElement("input");
        fileInputElement.type = "file";
        fileInputClickSpy = vi.fn();
        fileInputElement.click = fileInputClickSpy as any;
    });

    it("constructor adds icon container and icon image to host", () => {
        new LeftCanvas(hostElement, model, fileInputElement, "/upload.svg", {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
        });
        const iconContainer = hostElement.querySelector("#icon-container") as HTMLDivElement | null;
        const iconImage = hostElement.querySelector("#upload-icon") as HTMLImageElement | null;

        expect(iconContainer).not.toBeNull();
        expect(iconImage).not.toBeNull();
        expect(iconImage!.getAttribute("src")).toBe("/upload.svg");
    });

    it("init() wires click to file input and hover changes icon opacity", () => {
        const leftCanvas = new LeftCanvas(hostElement, model, fileInputElement, "/upload.svg", {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
        });

        leftCanvas.init();

        fakeRenderer.domElement.dispatchEvent(new MouseEvent("click"));
        expect(fileInputClickSpy).toHaveBeenCalledTimes(1);

        const iconImage = hostElement.querySelector("#upload-icon") as HTMLImageElement;

        fakeRenderer.domElement.dispatchEvent(new MouseEvent("mouseenter"));
        expect(iconImage.style.opacity).toBe("0.7");

        fakeRenderer.domElement.dispatchEvent(new MouseEvent("mouseleave"));
        expect(iconImage.style.opacity).toBe("0");
    });

    it("update() sizes icon container to model render size", () => {
        const leftCanvas = new LeftCanvas(hostElement, model, fileInputElement, "/upload.svg", {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
        });

        leftCanvas.init();
        leftCanvas.update();

        const iconContainer = hostElement.querySelector("#icon-container") as HTMLDivElement;

        expect(iconContainer.style.width).toBe("100px");
        expect(iconContainer.style.height).toBe("50px");
    });
});
