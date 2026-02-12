import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WebsiteController, { type ViewHandles } from "../../src/controller/WebsiteController";

vi.mock("../../src/util/imageUtils", async () => {
    const originalModule = await vi.importActual<typeof import("../../src/util/imageUtils")>(
        "../../src/util/imageUtils"
    );

    return {
        ...originalModule,
        isImage: vi.fn(() => true),
        readImageAsDataUrl: vi.fn(async () => "data:image/png;base64,TEST_DATA"),
        getImageAspectFromTexture: vi.fn(() => 1),
    };
});

type FakeImageModel = {
    imageDataUrl: string | null;
    texture: any | null;
    imageAspect: number;
    renderWidth: number;
    renderHeight: number;
    disposeTexture: () => void;
};

function setElementClientSize(element: HTMLElement, clientWidth: number, clientHeight: number): void {
    Object.defineProperty(element, "clientWidth", { value: clientWidth, configurable: true });
    Object.defineProperty(element, "clientHeight", { value: clientHeight, configurable: true });
}

function createImageFile(mimeType: string = "image/png"): File {
    return new File([new Uint8Array([1, 2, 3])], "test.png", { type: mimeType });
}

describe("WebsiteController", () => {
    let handles: ViewHandles;
    let websiteController: WebsiteController;

    let fakeModel: FakeImageModel;

    let leftViewInitSpy: ReturnType<typeof vi.fn>;
    let leftViewUpdateSpy: ReturnType<typeof vi.fn>;
    let rightViewInitSpy: ReturnType<typeof vi.fn>;
    let rightViewUpdateSpy: ReturnType<typeof vi.fn>;

    let createLeftViewSpy: ReturnType<typeof vi.fn>;
    let createRightViewSpy: ReturnType<typeof vi.fn>;
    let createTextureLoaderSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        document.body.className = "";

        const leftCanvasHost = document.createElement("div");
        const rightCanvasHost = document.createElement("div");
        const fileInput = document.createElement("input");
        fileInput.type = "file";

        setElementClientSize(rightCanvasHost, 800, 600);

        handles = { leftCanvasHost, rightCanvasHost, fileInput };

        const disposeTextureSpy = vi.fn();

        fakeModel = {
            imageDataUrl: null,
            texture: null,
            imageAspect: 1,
            renderWidth: 1,
            renderHeight: 1,
            disposeTexture: disposeTextureSpy,
        };

        leftViewInitSpy = vi.fn();
        leftViewUpdateSpy = vi.fn();
        rightViewInitSpy = vi.fn();
        rightViewUpdateSpy = vi.fn();

        const fakeLeftView = {
            init: leftViewInitSpy,
            update: leftViewUpdateSpy,
        };

        const fakeRightView = {
            init: rightViewInitSpy,
            update: rightViewUpdateSpy,
        };

        createLeftViewSpy = vi.fn(() => fakeLeftView as any);
        createRightViewSpy = vi.fn(() => fakeRightView as any);

        const fakeTexture = { colorSpace: undefined, image: { width: 100, height: 100 } } as any;

        const fakeTextureLoader = {
            load: (url: string, onLoad: (tex: any) => void, _onProgress?: any, _onError?: any) => {
                onLoad(fakeTexture);
            },
        };

        createTextureLoaderSpy = vi.fn(() => fakeTextureLoader as any);

        websiteController = new WebsiteController({
            createModel: () => fakeModel as any,
            createLeftView: createLeftViewSpy as any,
            createRightView: createRightViewSpy as any,
            createTextureLoader: createTextureLoaderSpy as any,
            uploadIconUrl: "/test-upload-icon.svg",
            defaultImageUrl: "data:image/png;base64,DEFAULT_IMAGE_DATA",
        });
    });

    afterEach(() => {
        websiteController.destroy(handles);
    });

    it("init() adds loaded class and initializes both views and updates them", async () => {
        websiteController.init(handles);

        expect(document.body.classList.contains("loaded")).toBe(true);

        expect(createLeftViewSpy).toHaveBeenCalledTimes(1);
        expect(createRightViewSpy).toHaveBeenCalledTimes(1);

        expect(leftViewInitSpy).toHaveBeenCalledTimes(1);
        expect(rightViewInitSpy).toHaveBeenCalledTimes(1);

        expect(leftViewUpdateSpy).toHaveBeenCalled();
        expect(rightViewUpdateSpy).toHaveBeenCalled();

        expect(fakeModel.renderWidth).toBe(600);
        expect(fakeModel.renderHeight).toBe(600);

        await Promise.resolve();
        await Promise.resolve();

        expect(createTextureLoaderSpy).toHaveBeenCalledTimes(1);
        expect(fakeModel.imageDataUrl).toBe("data:image/png;base64,DEFAULT_IMAGE_DATA");
    });

    it("resize event recomputes sizing and updates views again", () => {
        websiteController.init(handles);

        const leftUpdateCallsBeforeResize = leftViewUpdateSpy.mock.calls.length;
        const rightUpdateCallsBeforeResize = rightViewUpdateSpy.mock.calls.length;

        setElementClientSize(handles.rightCanvasHost, 400, 400);

        window.dispatchEvent(new Event("resize"));

        expect(leftViewUpdateSpy.mock.calls.length).toBeGreaterThan(leftUpdateCallsBeforeResize);
        expect(rightViewUpdateSpy.mock.calls.length).toBeGreaterThan(rightUpdateCallsBeforeResize);

        expect(fakeModel.renderWidth).toBe(400);
        expect(fakeModel.renderHeight).toBe(400);
    });

    it("file input change loads image, disposes prior texture, updates model, and updates views", async () => {
        websiteController.init(handles);

        const imageFile = createImageFile("image/png");

        Object.defineProperty(handles.fileInput, "files", {
            value: [imageFile],
            configurable: true,
        });

        const leftUpdateCallsBeforeChange = leftViewUpdateSpy.mock.calls.length;
        const rightUpdateCallsBeforeChange = rightViewUpdateSpy.mock.calls.length;

        handles.fileInput.dispatchEvent(new Event("change"));

        await Promise.resolve();
        await Promise.resolve();

        expect(fakeModel.disposeTexture).toHaveBeenCalled();

        expect(createTextureLoaderSpy).toHaveBeenCalled();

        expect(leftViewUpdateSpy.mock.calls.length).toBeGreaterThan(leftUpdateCallsBeforeChange);
        expect(rightViewUpdateSpy.mock.calls.length).toBeGreaterThan(rightUpdateCallsBeforeChange);

        expect(fakeModel.imageDataUrl).toBe("data:image/png;base64,TEST_DATA");
        expect(fakeModel.texture).not.toBeNull();
    });

    it("drop event with image file loads image and updates views", async () => {
        websiteController.init(handles);

        const imageFile = createImageFile("image/png");

        const leftUpdateCallsBeforeDrop = leftViewUpdateSpy.mock.calls.length;
        const rightUpdateCallsBeforeDrop = rightViewUpdateSpy.mock.calls.length;

        const dropEvent = new Event("drop", { bubbles: true, cancelable: true });
        Object.defineProperty(dropEvent, "dataTransfer", {
            value: { files: [imageFile] },
            configurable: true,
        });

        document.body.dispatchEvent(dropEvent);

        await Promise.resolve();
        await Promise.resolve();

        expect(createTextureLoaderSpy).toHaveBeenCalled();
        expect(fakeModel.imageDataUrl).toBe("data:image/png;base64,TEST_DATA");
        expect(fakeModel.texture).not.toBeNull();

        expect(leftViewUpdateSpy.mock.calls.length).toBeGreaterThan(leftUpdateCallsBeforeDrop);
        expect(rightViewUpdateSpy.mock.calls.length).toBeGreaterThan(rightUpdateCallsBeforeDrop);
    });
});
