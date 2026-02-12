import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ImageModel } from "../../src/model/ImageModel";
import { ThreeCanvasBase } from "../../src/view/ThreeCanvasBase";

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

class TestCanvas extends ThreeCanvasBase {
}

function createFakeModel(): ImageModel {
    return {
        imageDataUrl: null,
        texture: null,
        imageAspect: 1,
        renderWidth: 10,
        renderHeight: 20,
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

describe("ThreeCanvasBase", () => {
    let hostElement: HTMLDivElement;
    let model: ImageModel;

    let fakeScene: FakeScene;
    let fakeCamera: FakeCamera;
    let fakeRenderer: FakeRenderer;
    let fakeMesh: FakeMesh;

    beforeEach(() => {
        hostElement = document.createElement("div");
        model = createFakeModel();

        fakeScene = createFakeScene();
        fakeCamera = createFakeCamera();
        fakeRenderer = createFakeRenderer();
        fakeMesh = createFakeMesh();
    });

    it("init() creates renderer canvas element and appends it to host, and sets styles", () => {
        const testCanvas = new TestCanvas(hostElement, model, {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
        });

        testCanvas.init();

        expect(hostElement.contains(fakeRenderer.domElement)).toBe(true);
        expect(fakeRenderer.domElement.style.border).toContain("2px solid");
        expect(fakeRenderer.domElement.style.borderRadius).toBe("5px");
        expect(fakeScene.add).toHaveBeenCalledTimes(1);
    });

    it("update() sets plane scale, updates renderer size, updates camera projection, and renders", () => {
        const testCanvas = new TestCanvas(hostElement, model, {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
        });

        testCanvas.init();
        testCanvas.update();

        expect(fakeMesh.scale.set).toHaveBeenCalledWith(10, 20, 1);

        expect(fakeRenderer.setSize).toHaveBeenCalledWith(10, 20, false);

        expect(fakeCamera.left).toBe(-5);
        expect(fakeCamera.right).toBe(5);
        expect(fakeCamera.top).toBe(10);
        expect(fakeCamera.bottom).toBe(-10);
        expect(fakeCamera.updateProjectionMatrix).toHaveBeenCalledTimes(1);

        expect(fakeRenderer.render).toHaveBeenCalledTimes(1);
    });

    it("update() sets material map and marks needsUpdate when model has a texture", () => {
        const textureObject = {} as any;
        model.texture = textureObject;

        const testCanvas = new TestCanvas(hostElement, model, {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
        });

        testCanvas.init();
        testCanvas.update();

        expect(fakeMesh.material.map).toBe(textureObject);
        expect(fakeMesh.material.color.set).toHaveBeenCalledWith(0xffffff);
        expect(fakeMesh.material.needsUpdate).toBe(true);
    });

    it("destroy() disposes renderer, geometry, and material", () => {
        const testCanvas = new TestCanvas(hostElement, model, {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
        });

        testCanvas.init();
        testCanvas.destroy();

        expect(fakeRenderer.dispose).toHaveBeenCalledTimes(1);
        expect(fakeMesh.geometry.dispose).toHaveBeenCalledTimes(1);
        expect(fakeMesh.material.dispose).toHaveBeenCalledTimes(1);
    });
});
