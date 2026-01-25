import type { ImageModel } from "../model/ImageModel.ts";
import { ThreeCanvasBase } from "./ThreeCanvasBase";
import { PipelineController } from "../controller/PipelineController";

export class RightCanvas extends ThreeCanvasBase {
    private pipeline!: PipelineController;

    constructor(host: HTMLElement, model: ImageModel) {
        super(host, model);
    }

    override init(): void {
        super.init();

        this.pipeline = new PipelineController(this.renderer, this.scene, this.camera);
        this.pipeline.init();
    }

    override update(): void {
        this.pipeline.setInputTexture(this.model.texture ?? null);
        this.pipeline.setSize(this.model.renderWidth, this.model.renderHeight);

        super.update();
    }

    protected override renderOnce(): void {
        this.pipeline.render();
    }
}
