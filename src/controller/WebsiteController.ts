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

export default class WebsiteController {
    private model: ImageModel = new AppModelImpl();
    private leftView!: LeftCanvas;
    private rightView!: RightCanvas;

    init(handles: ViewHandles): void {
        document.body.classList.add("loaded");

        this.leftView = new LeftCanvas(handles.leftCanvasHost, this.model, handles.fileInput, uploadIconUrl);
        this.rightView = new RightCanvas(handles.rightCanvasHost, this.model);

        this.leftView.init();
        this.rightView.init();

        this.recomputeSizing(handles.rightCanvasHost);
        this.updateViews();

        window.addEventListener("resize", () => {
            this.recomputeSizing(handles.rightCanvasHost);
            this.updateViews();
        });

        ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) => {
            document.body.addEventListener(ev, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        document.body.addEventListener("drop", async (event) => {
            const file = event.dataTransfer?.files?.[0];
            if (!file || !isImage(file)) return;
            await this.loadImageFromFile(file, handles.rightCanvasHost);
        });

        handles.fileInput.addEventListener("change", async () => {
            const file = handles.fileInput.files?.[0];
            if (!file || !isImage(file)) return;
            await this.loadImageFromFile(file, handles.rightCanvasHost);
        });

        this.loadImageFromUrl(defaultImageUrl, handles.rightCanvasHost).then(() => {});
    }

    private async loadImageFromFile(file: File, sizingHost: HTMLElement): Promise<void> {
        const dataUrl = await readImageAsDataUrl(file);
        await this.loadImageFromUrl(dataUrl, sizingHost);
    }

    private async loadImageFromUrl(dataUrl: string, sizingHost: HTMLElement): Promise<void> {
        this.model.imageDataUrl = dataUrl;

        this.model.disposeTexture();

        const loader = new THREE.TextureLoader();
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
