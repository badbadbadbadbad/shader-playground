import type { AppModel } from "../model/AppModel";
import { ThreeCanvasBase } from "./ThreeCanvasBase";
import { PipelineController } from "../controller/PipelineController";

export class RightCanvas extends ThreeCanvasBase {
    private pipeline!: PipelineController;

    constructor(host: HTMLElement, model: AppModel) {
        super(host, model);
    }

    override init(): void {
        super.init();

        this.pipeline = new PipelineController(this.renderer, this.scene, this.camera);
        this.pipeline.init();
    }

    override update(): void {
        super.update();
    }

    protected override renderOnce(): void {
        this.pipeline.setSize(this.model.renderWidth, this.model.renderHeight);
        this.pipeline.render();
    }
}
