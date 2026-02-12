import { describe, it, expect, vi, beforeEach } from "vitest";
import * as THREE from "three";
import { PipelineController } from "../../src/controller/PipelineController";
import { PIPELINE_IDS } from "../../src/shaders/pipelines/PipelineId";

type FakeComposer = {
    passes: any[];
    addPass: (pass: any) => void;
    setSize: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
};

type FakeGuiController = {
    name: ReturnType<typeof vi.fn>;
    onChange: ReturnType<typeof vi.fn>;
};

type FakeGuiFolder = {
    open: ReturnType<typeof vi.fn>;
    addFolder: ReturnType<typeof vi.fn>;
    add: ReturnType<typeof vi.fn>;
    addCalls: Array<{ target: any; propertyName: string; options?: any }>;
    subfolders: Record<string, FakeGuiFolder>;
};

type FakeGui = {
    destroy: ReturnType<typeof vi.fn>;
    addFolder: ReturnType<typeof vi.fn>;
    add: ReturnType<typeof vi.fn>;
    controllersRecursive: ReturnType<typeof vi.fn>;
    addCalls: Array<{ target: any; propertyName: string; options?: any }>;
    folders: Record<string, FakeGuiFolder>;
    capturedOnChangeCallbacks: Array<(value: any) => void>;
    displayControllers: Array<{ updateDisplay: ReturnType<typeof vi.fn> }>;
};

function createFakeComposer(): FakeComposer {
    const fakeComposer: FakeComposer = {
        passes: [],
        addPass: (pass: any) => {
            fakeComposer.passes.push(pass);
        },
        setSize: vi.fn(),
        render: vi.fn(),
    };
    return fakeComposer;
}

function createFakeGuiController(fakeGui: FakeGui): FakeGuiController {
    const fakeGuiController: FakeGuiController = {
        name: vi.fn(() => fakeGuiController),
        onChange: vi.fn((callback: (value: any) => void) => {
            fakeGui.capturedOnChangeCallbacks.push(callback);
            return fakeGuiController;
        }),
    };
    return fakeGuiController;
}

function createFakeGuiFolder(fakeGui: FakeGui): FakeGuiFolder {
    const fakeGuiFolder: FakeGuiFolder = {
        open: vi.fn(),
        addFolder: vi.fn((folderName: string) => {
            const subfolder = createFakeGuiFolder(fakeGui);
            fakeGuiFolder.subfolders[folderName] = subfolder;
            return subfolder;
        }),
        add: vi.fn((target: any, propertyName: string, options?: any) => {
            fakeGuiFolder.addCalls.push({ target, propertyName, options });
            return createFakeGuiController(fakeGui);
        }),
        addCalls: [],
        subfolders: {},
    };
    return fakeGuiFolder;
}

function createFakeGui(): FakeGui {
    const fakeGui: FakeGui = {
        destroy: vi.fn(),
        addFolder: vi.fn((folderName: string) => {
            if (!fakeGui.folders[folderName]) {
                fakeGui.folders[folderName] = createFakeGuiFolder(fakeGui);
            }
            return fakeGui.folders[folderName];
        }),
        add: vi.fn((target: any, propertyName: string, options?: any) => {
            fakeGui.addCalls.push({ target, propertyName, options });
            return createFakeGuiController(fakeGui);
        }),
        controllersRecursive: vi.fn(() => fakeGui.displayControllers),
        addCalls: [],
        folders: {},
        capturedOnChangeCallbacks: [],
        displayControllers: [{ updateDisplay: vi.fn() }, { updateDisplay: vi.fn() }],
    };
    return fakeGui;
}

function createResolutionUniform() {
    return { value: { set: vi.fn() } };
}

function cloneUniformsKeepingFunctions(uniforms: any): any {
    const cloned: any = {};
    for (const key of Object.keys(uniforms ?? {})) {
        const originalUniform = uniforms[key];
        if (!originalUniform || typeof originalUniform !== "object" || !("value" in originalUniform)) {
            cloned[key] = originalUniform;
            continue;
        }

        const originalValue = originalUniform.value;

        if (typeof originalValue === "number") {
            cloned[key] = { value: originalValue };
            continue;
        }

        if (originalValue && typeof originalValue === "object" && "set" in originalValue && typeof originalValue.set === "function") {
            cloned[key] = { value: { set: originalValue.set } };
            continue;
        }

        cloned[key] = { value: originalValue };
    }
    return cloned;
}

function createFakeShaderPass(uniforms: any) {
    return {
        uniforms,
        material: {
            glslVersion: undefined as any,
            needsUpdate: false,
        },
    };
}

describe("PipelineController", () => {
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.Camera;

    let canvasElement: HTMLCanvasElement;

    let fakeComposer: FakeComposer;

    let firstGuiInstance: FakeGui;
    let secondGuiInstance: FakeGui;

    let createGuiCallCount: number;

    let createComposerSpy: ReturnType<typeof vi.fn>;
    let createRenderPassSpy: ReturnType<typeof vi.fn>;
    let createShaderPassSpy: ReturnType<typeof vi.fn>;
    let createGuiSpy: ReturnType<typeof vi.fn>;
    let cloneUniformsSpy: ReturnType<typeof vi.fn>;

    let pipelines: any;
    let pipelineList: any[];

    let defaultPipelineId: string;

    beforeEach(() => {
        defaultPipelineId = PIPELINE_IDS.ANISOTROPIC_KUWAHARA as unknown as string;

        canvasElement = document.createElement("canvas");
        (canvasElement as any).toDataURL = vi.fn(() => "data:image/png;base64,FAKE_DATA_URL");

        renderer = { domElement: canvasElement } as any;
        scene = {} as any;
        camera = {} as any;

        fakeComposer = createFakeComposer();

        firstGuiInstance = createFakeGui();
        secondGuiInstance = createFakeGui();
        createGuiCallCount = 0;

        createComposerSpy = vi.fn(() => fakeComposer);

        createRenderPassSpy = vi.fn((sceneArgument: any, cameraArgument: any) => {
            return { kind: "RenderPass", sceneArgument, cameraArgument };
        });

        createShaderPassSpy = vi.fn((config: any) => {
            return createFakeShaderPass(config.uniforms);
        });

        createGuiSpy = vi.fn(() => {
            createGuiCallCount += 1;
            return createGuiCallCount === 1 ? firstGuiInstance : secondGuiInstance;
        });

        cloneUniformsSpy = vi.fn((uniforms: any) => cloneUniformsKeepingFunctions(uniforms));

        pipelineList = [
            { label: "Default Pipeline", id: defaultPipelineId },
            { label: "Alternate Pipeline", id: "ALTERNATE_PIPELINE" },
        ];

        pipelines = {
            [defaultPipelineId]: {
                effects: [
                    {
                        id: "EFFECT_ONE",
                        label: "Effect One",
                        vertex: "vertex shader one",
                        fragment: "fragment shader one",
                        uniforms: {
                            resolution: createResolutionUniform(),
                            inputTex: { value: null },
                            intensity: { value: 1 },
                        },
                        buildGui: vi.fn(),
                    },
                    {
                        id: "EFFECT_TWO",
                        vertex: "vertex shader two",
                        fragment: "fragment shader two",
                        uniforms: {
                            resolution: createResolutionUniform(),
                            inputTex: { value: null },
                            strength: { value: 5 },
                        },
                    },
                ],
            },
        };
    });

    it("init() builds passes for the default pipeline and rebuilds GUI", () => {
        const pipelineController = new PipelineController(renderer, scene, camera, {
            createComposer: createComposerSpy,
            createRenderPass: createRenderPassSpy,
            createShaderPass: createShaderPassSpy,
            createGui: createGuiSpy,
            cloneUniforms: cloneUniformsSpy,
            pipelines,
            pipelineList,
        } as any);

        pipelineController.init();

        expect(createComposerSpy).toHaveBeenCalledTimes(1);
        expect(createRenderPassSpy).toHaveBeenCalledTimes(1);
        expect(createShaderPassSpy).toHaveBeenCalledTimes(2);

        expect(fakeComposer.passes.length).toBe(3);
        expect(fakeComposer.passes[0].kind).toBe("RenderPass");

        expect(firstGuiInstance.destroy).toHaveBeenCalledTimes(1);
        expect(createGuiSpy).toHaveBeenCalledTimes(2);
        expect(secondGuiInstance.addFolder).toHaveBeenCalled();
    });

    it("setSize() forwards size to composer and updates resolution uniforms", () => {
        const pipelineController = new PipelineController(renderer, scene, camera, {
            createComposer: createComposerSpy,
            createRenderPass: createRenderPassSpy,
            createShaderPass: createShaderPassSpy,
            createGui: createGuiSpy,
            cloneUniforms: cloneUniformsSpy,
            pipelines,
            pipelineList,
        } as any);

        pipelineController.init();

        pipelineController.setSize(320, 200);

        expect(fakeComposer.setSize).toHaveBeenCalledWith(320, 200);

        const firstEffectPass = fakeComposer.passes[1];
        const secondEffectPass = fakeComposer.passes[2];

        expect(firstEffectPass.uniforms.resolution.value.set).toHaveBeenCalledWith(320, 200);
        expect(secondEffectPass.uniforms.resolution.value.set).toHaveBeenCalledWith(320, 200);
    });

    it("setInputTexture() forwards texture into inputTex uniforms", () => {
        const pipelineController = new PipelineController(renderer, scene, camera, {
            createComposer: createComposerSpy,
            createRenderPass: createRenderPassSpy,
            createShaderPass: createShaderPassSpy,
            createGui: createGuiSpy,
            cloneUniforms: cloneUniformsSpy,
            pipelines,
            pipelineList,
        } as any);

        pipelineController.init();

        const texture = {} as any as THREE.Texture;

        pipelineController.setInputTexture(texture);

        const firstEffectPass = fakeComposer.passes[1];
        const secondEffectPass = fakeComposer.passes[2];

        expect(firstEffectPass.uniforms.inputTex.value).toBe(texture);
        expect(secondEffectPass.uniforms.inputTex.value).toBe(texture);
    });

    it("setPipeline() clears old passes and rebuilds render pass and effect passes, preserving size and input texture", () => {
        pipelines.ALTERNATE_PIPELINE = {
            effects: [
                {
                    id: "EFFECT_THREE",
                    vertex: "vertex shader three",
                    fragment: "fragment shader three",
                    uniforms: {
                        resolution: createResolutionUniform(),
                        inputTex: { value: null },
                        amount: { value: 2 },
                    },
                },
            ],
        };

        const pipelineController = new PipelineController(renderer, scene, camera, {
            createComposer: createComposerSpy,
            createRenderPass: createRenderPassSpy,
            createShaderPass: createShaderPassSpy,
            createGui: createGuiSpy,
            cloneUniforms: cloneUniformsSpy,
            pipelines,
            pipelineList,
        } as any);

        pipelineController.setSize(111, 222);

        const texture = {} as any as THREE.Texture;
        pipelineController.setInputTexture(texture);

        pipelineController.setPipeline(defaultPipelineId as any);
        expect(fakeComposer.passes.length).toBe(3);

        pipelineController.setPipeline("ALTERNATE_PIPELINE" as any);

        expect(fakeComposer.passes.length).toBe(2);

        const renderPass = fakeComposer.passes[0];
        const effectPass = fakeComposer.passes[1];

        expect(renderPass.kind).toBe("RenderPass");
        expect(effectPass.uniforms.resolution.value.set).toHaveBeenCalledWith(111, 222);
        expect(effectPass.uniforms.inputTex.value).toBe(texture);
    });

    it("resetGuiUniformsToDefaults() resets numeric uniforms, updates GUI displays, and renders", () => {
        const pipelineController = new PipelineController(renderer, scene, camera, {
            createComposer: createComposerSpy,
            createRenderPass: createRenderPassSpy,
            createShaderPass: createShaderPassSpy,
            createGui: createGuiSpy,
            cloneUniforms: cloneUniformsSpy,
            pipelines,
            pipelineList,
        } as any);

        pipelineController.setPipeline(defaultPipelineId as any);

        const firstEffectPass = fakeComposer.passes[1];
        const secondEffectPass = fakeComposer.passes[2];

        firstEffectPass.uniforms.intensity.value = 999;
        secondEffectPass.uniforms.strength.value = 999;

        const settingsFolder = secondGuiInstance.folders["Settings"];
        expect(settingsFolder).toBeTruthy();

        const resetAddCall = settingsFolder.addCalls.find((call) => call.propertyName === "reset");
        expect(resetAddCall).toBeTruthy();

        const resetTargetObject = resetAddCall!.target as { reset: () => void };
        resetTargetObject.reset();

        expect(firstEffectPass.uniforms.intensity.value).toBe(1);
        expect(secondEffectPass.uniforms.strength.value).toBe(5);

        expect(secondGuiInstance.displayControllers[0].updateDisplay).toHaveBeenCalled();
        expect(secondGuiInstance.displayControllers[1].updateDisplay).toHaveBeenCalled();

        expect(fakeComposer.render).toHaveBeenCalled();
    });

    it("downloadImage() renders and triggers an anchor click with a PNG data URL", () => {
        const pipelineController = new PipelineController(renderer, scene, camera, {
            createComposer: createComposerSpy,
            createRenderPass: createRenderPassSpy,
            createShaderPass: createShaderPassSpy,
            createGui: createGuiSpy,
            cloneUniforms: cloneUniformsSpy,
            pipelines,
            pipelineList,
        } as any);

        pipelineController.setPipeline(defaultPipelineId as any);

        const anchorClickSpy = vi.fn();

        const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tagName: any) => {
            if (tagName === "a") {
                return {
                    href: "",
                    download: "",
                    click: anchorClickSpy,
                } as any;
            }
            return document.createElement(tagName);
        });

        const downloadAddCall = secondGuiInstance.addCalls.find((call) => call.propertyName === "downloadImage");
        expect(downloadAddCall).toBeTruthy();

        const downloadTargetObject = downloadAddCall!.target as { downloadImage: () => void };
        downloadTargetObject.downloadImage();

        expect(fakeComposer.render).toHaveBeenCalled();
        expect(anchorClickSpy).toHaveBeenCalledTimes(1);

        createElementSpy.mockRestore();
    });
});
