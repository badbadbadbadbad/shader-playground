import type { ImageModel } from "../model/ImageModel.ts";
import { ThreeCanvasBase, type ThreeCanvasBaseDependencies } from "./ThreeCanvasBase";
import { PipelineController } from "../controller/PipelineController";

export type RightCanvasDependencies = ThreeCanvasBaseDependencies & {
    createPipelineController?: (renderer: any, scene: any, camera: any) => PipelineController;
};

export class RightCanvas extends ThreeCanvasBase {
    private pipeline!: PipelineController;
    private readonly rightCanvasDependencies: Required<RightCanvasDependencies>;

    constructor(host: HTMLElement, model: ImageModel, dependencies: RightCanvasDependencies = {}) {
        super(host, model, dependencies);

        this.rightCanvasDependencies = {
            ...this.dependencies,
            createPipelineController:
                dependencies.createPipelineController ?? ((renderer, scene, camera) => new PipelineController(renderer, scene, camera)),
        };
    }

    override init(): void {
        super.init();

        this.pipeline = this.rightCanvasDependencies.createPipelineController(this.renderer, this.scene, this.camera);
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
