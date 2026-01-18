import { ThreeCanvasBase } from "./ThreeCanvasBase";
import type { AppModel } from "../model/AppModel";

export class LeftCanvas extends ThreeCanvasBase {
    private fileInput: HTMLInputElement;
    private readonly iconContainer!: HTMLDivElement;
    private readonly iconImg!: HTMLImageElement;

    constructor(host: HTMLElement, model: AppModel, fileInput: HTMLInputElement, uploadIconUrl: string) {
        super(host, model);
        this.fileInput = fileInput;

        this.iconImg = document.createElement("img");
        this.iconImg.id = "upload-icon";
        this.iconImg.src = uploadIconUrl;

        this.iconContainer = document.createElement("div");
        this.iconContainer.id = "icon-container";
        this.iconContainer.appendChild(this.iconImg);
        this.host.appendChild(this.iconContainer);
    }

    override init(): void {
        super.init();

        this.renderer.domElement.addEventListener("click", () => this.fileInput.click());
        this.renderer.domElement.addEventListener("mouseenter", () => (this.iconImg.style.opacity = "0.7"));
        this.renderer.domElement.addEventListener("mouseleave", () => (this.iconImg.style.opacity = "0"));
    }

    override update(): void {
        super.update();

        this.iconContainer.style.width = `${this.model.renderWidth}px`;
        this.iconContainer.style.height = `${this.model.renderHeight}px`;
    }
}
