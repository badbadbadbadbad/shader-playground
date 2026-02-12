import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ImageModel } from "../../src/model/ImageModel";
import { RightCanvas } from "../../src/view/RightCanvas";

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

type FakePipelineController = {
    init: ReturnType<typeof vi.fn>;
    setInputTexture: ReturnType<typeof vi.fn>;
    setSize: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
};

function createFakeModel(): ImageModel {
    return {
        imageDataUrl: null,
        texture: null,
        imageAspect: 1,
        renderWidth: 64,
        renderHeight: 32,
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

describe("RightCanvas", () => {
    let hostElement: HTMLDivElement;
    let model: ImageModel;

    let fakeScene: FakeScene;
    let fakeCamera: FakeCamera;
    let fakeRenderer: FakeRenderer;
    let fakeMesh: FakeMesh;

    let fakePipelineController: FakePipelineController;
    let createPipelineControllerSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        hostElement = document.createElement("div");
        model = createFakeModel();

        fakeScene = createFakeScene();
        fakeCamera = createFakeCamera();
        fakeRenderer = createFakeRenderer();
        fakeMesh = createFakeMesh();

        fakePipelineController = {
            init: vi.fn(),
            setInputTexture: vi.fn(),
            setSize: vi.fn(),
            render: vi.fn(),
        };

        createPipelineControllerSpy = vi.fn(() => fakePipelineController as any);
    });

    it("init() creates pipeline controller and initializes it", () => {
        const rightCanvas = new RightCanvas(hostElement, model, {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
            createPipelineController: createPipelineControllerSpy as any,
        });

        rightCanvas.init();

        expect(createPipelineControllerSpy).toHaveBeenCalledTimes(1);
        expect(fakePipelineController.init).toHaveBeenCalledTimes(1);
    });

    it("update() forwards texture and size to pipeline before base update triggers render", () => {
        const rightCanvas = new RightCanvas(hostElement, model, {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
            createPipelineController: createPipelineControllerSpy as any,
        });

        rightCanvas.init();

        const textureObject = {} as any;
        model.texture = textureObject as any;

        rightCanvas.update();

        expect(fakePipelineController.setInputTexture).toHaveBeenCalledWith(textureObject);
        expect(fakePipelineController.setSize).toHaveBeenCalledWith(64, 32);

        expect(fakePipelineController.render).toHaveBeenCalledTimes(1);
    });

    it("update() passes null texture when model texture is null", () => {
        const rightCanvas = new RightCanvas(hostElement, model, {
            createScene: () => fakeScene as any,
            createColor: () => ({}) as any,
            createPlaneGeometry: () => ({}) as any,
            createMeshBasicMaterial: () => ({}) as any,
            createMesh: () => fakeMesh as any,
            createOrthographicCamera: () => fakeCamera as any,
            createWebGLRenderer: () => fakeRenderer as any,
            createPipelineController: createPipelineControllerSpy as any,
        });

        rightCanvas.init();
        model.texture = null;

        rightCanvas.update();

        expect(fakePipelineController.setInputTexture).toHaveBeenCalledWith(null);
    });
});
