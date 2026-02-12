import * as THREE from "three";
import type { ImageModel } from "../model/ImageModel.ts";
import { ImageModel as AppModelImpl } from "../model/ImageModel.ts";
import { LeftCanvas } from "../view/LeftCanvas.ts";
import { RightCanvas } from "../view/RightCanvas.ts";
import { fitRect, isImage, readImageAsDataUrl, getImageAspectFromTexture } from "../util/imageUtils.ts";

import uploadIconUrl from "../assets/icon/upload.svg";
import defaultImageUrl from "../assets/img/snow.png";

export type ViewHandles = {
    leftCanvasHost: HTMLElement;
    rightCanvasHost: HTMLElement;
    fileInput: HTMLInputElement;
};

type Dependencies = {
    createModel?: () => ImageModel;
    createLeftView?: (host: HTMLElement, model: ImageModel, fileInput: HTMLInputElement, uploadIcon: string) => LeftCanvas;
    createRightView?: (host: HTMLElement, model: ImageModel) => RightCanvas;
    createTextureLoader?: () => THREE.TextureLoader;
    uploadIconUrl?: string;
    defaultImageUrl?: string;
};

export default class WebsiteController {
    private readonly model: ImageModel;
    private leftView!: LeftCanvas;
    private rightView!: RightCanvas;

    private readonly deps: Required<Dependencies>;

    private onResize?: () => void;
    private onDropPrevent?: (e: Event) => void;
    private onDrop?: (e: DragEvent) => void;
    private onFileChange?: () => void;

    constructor(deps: Dependencies = {}) {
        this.deps = {
            createModel: deps.createModel ?? (() => new AppModelImpl()),
            createLeftView:
                deps.createLeftView ??
                ((host, model, fileInput, uploadIcon) => new LeftCanvas(host, model, fileInput, uploadIcon)),
            createRightView: deps.createRightView ?? ((host, model) => new RightCanvas(host, model)),
            createTextureLoader: deps.createTextureLoader ?? (() => new THREE.TextureLoader()),
            uploadIconUrl: deps.uploadIconUrl ?? uploadIconUrl,
            defaultImageUrl: deps.defaultImageUrl ?? defaultImageUrl,
        };

        this.model = this.deps.createModel();
    }

    init(handles: ViewHandles): void {
        document.body.classList.add("loaded");

        this.leftView = this.deps.createLeftView(
            handles.leftCanvasHost,
            this.model,
            handles.fileInput,
            this.deps.uploadIconUrl
        );
        this.rightView = this.deps.createRightView(handles.rightCanvasHost, this.model);

        this.leftView.init();
        this.rightView.init();

        this.recomputeSizing(handles.rightCanvasHost);
        this.updateViews();

        this.onResize = () => {
            this.recomputeSizing(handles.rightCanvasHost);
            this.updateViews();
        };
        window.addEventListener("resize", this.onResize);

        this.onDropPrevent = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
            document.body.addEventListener(ev, this.onDropPrevent!)
        );

        this.onDrop = async (event: DragEvent) => {
            const file = event.dataTransfer?.files?.[0];
            if (!file || !isImage(file)) return;
            await this.loadImageFromFile(file, handles.rightCanvasHost);
        };
        document.body.addEventListener("drop", this.onDrop);

        this.onFileChange = async () => {
            const file = handles.fileInput.files?.[0];
            if (!file || !isImage(file)) return;
            await this.loadImageFromFile(file, handles.rightCanvasHost);
        };
        handles.fileInput.addEventListener("change", this.onFileChange);

        void this.loadImageFromUrl(this.deps.defaultImageUrl, handles.rightCanvasHost);
    }

    destroy(handles?: ViewHandles): void {
        if (this.onResize) window.removeEventListener("resize", this.onResize);

        if (this.onDropPrevent) {
            ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
                document.body.removeEventListener(ev, this.onDropPrevent!)
            );
        }

        if (this.onDrop) document.body.removeEventListener("drop", this.onDrop);

        if (handles && this.onFileChange) {
            handles.fileInput.removeEventListener("change", this.onFileChange);
        }
    }

    private async loadImageFromFile(file: File, sizingHost: HTMLElement): Promise<void> {
        const dataUrl = await readImageAsDataUrl(file);
        await this.loadImageFromUrl(dataUrl, sizingHost);
    }

    private async loadImageFromUrl(dataUrl: string, sizingHost: HTMLElement): Promise<void> {
        this.model.imageDataUrl = dataUrl;

        this.model.disposeTexture();

        const loader = this.deps.createTextureLoader();
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
            loader.load(dataUrl, resolve, undefined, reject);
        });

        texture.colorSpace = THREE.SRGBColorSpace;

        this.model.texture = texture;
        this.model.imageAspect = getImageAspectFromTexture(texture);

        this.recomputeSizing(sizingHost);
        this.updateViews();
    }

    private recomputeSizing(hostForSizing: HTMLElement): void {
        const containerW = hostForSizing.clientWidth || 1;
        const containerH = hostForSizing.clientHeight || 1;

        const { w, h } = fitRect(containerW, containerH, this.model.imageAspect || 1);
        this.model.renderWidth = Math.max(1, Math.floor(w));
        this.model.renderHeight = Math.max(1, Math.floor(h));
    }

    private updateViews(): void {
        this.leftView.update();
        this.rightView.update();
    }
}
