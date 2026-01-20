import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import GUI from "lil-gui";

import { PIPELINES, PIPELINE_LIST } from "../shaders/pipelines/PipelineRegistry.ts";
import {PIPELINE_IDS, type PipelineId} from "../shaders/pipelines/PipelineId.ts";

type BuiltPass = { effect: any; pass: ShaderPass };

export class PipelineController {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.Camera;
    private readonly canvas: HTMLCanvasElement;
    private readonly renderDebounceMs = 33;

    private inputTexture: THREE.Texture | null = null;
    private composer: EffectComposer;
    private gui: GUI;
    private activeId: PipelineId = PIPELINE_IDS.ANISOTROPIC_KUWAHARA;
    private guiState: { activePipeline: PipelineId } = { activePipeline: PIPELINE_IDS.ANISOTROPIC_KUWAHARA };

    private renderTimer : number | null = null;

    private renderSize = { width: 1, height: 1 };

    private built: BuiltPass[] = [];

    constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
        this.scene = scene;
        this.camera = camera;

        this.canvas = renderer.domElement;

        this.composer = new EffectComposer(renderer);
        this.gui = new GUI();
    }

    init(): void {
        this.setPipeline(this.activeId);
    }

    setSize(width: number, height: number): void {
        this.renderSize.width = width;
        this.renderSize.height = height;

        this.composer.setSize(width, height);

        for (const { pass } of this.built) {
            const uniforms = pass.uniforms as any;
            if (uniforms?.resolution?.value?.set) {
                uniforms.resolution.value.set(width, height);
            }
        }
    }

    setInputTexture(texture: THREE.Texture | null): void {
        this.inputTexture = texture;

        for (const {pass} of this.built) {
            const uniforms = pass.uniforms as any;
            if (uniforms?.inputTex) {
                uniforms.inputTex.value = texture;
            }
        }
    }

    setPipeline(id: PipelineId): void {
        this.activeId = id;
        this.guiState.activePipeline = id;

        this.composer.passes.length = 0;
        this.built = [];

        this.composer.addPass(new RenderPass(this.scene, this.camera as any));

        const pipeline = PIPELINES[id];
        for (const effect of pipeline.effects) {
            const uniforms = THREE.UniformsUtils.clone(effect.uniforms);

            const pass = new ShaderPass({
                uniforms,
                vertexShader: effect.vertex,
                fragmentShader: effect.fragment,
            });

            pass.material.glslVersion = THREE.GLSL3;
            pass.material.needsUpdate = true;

            this.composer.addPass(pass);
            this.built.push({ effect, pass });
        }

        this.rebuildGuiForPipeline();

        this.setSize(this.renderSize.width, this.renderSize.height);
        this.setInputTexture(this.inputTexture);

        this.requestRender();
    }

    private rebuildGuiForPipeline(): void {
        this.gui.destroy();
        this.gui = new GUI();

        this.gui.add({ downloadImage: () => this.downloadImage() }, "downloadImage").name("Download image");

        const options = Object.fromEntries(
            PIPELINE_LIST.map((pipeline) => [pipeline.label, pipeline.id])
        ) as Record<string, PipelineId>;

        this.gui
            .add(this.guiState, "activePipeline", options)
            .name("Pipeline")
            .onChange((v: PipelineId) => {
                this.setPipeline(v);
            });

        const settings = this.gui.addFolder("Settings");
        settings.open();

        for (const { effect, pass } of this.built) {
            if (!effect.buildGui) continue;
            effect.buildGui(settings as any, pass.uniforms, () => this.requestRender(), effect);
        }
    }

    requestRender(): void {
        if (this.renderTimer !== null) return;

        this.renderTimer = window.setTimeout(() => {
            this.renderTimer = null;
            this.render();
        }, this.renderDebounceMs);
    }

    render(): void {
        this.composer.render();
    }

    private downloadImage(): void {
        this.render();

        const dataUrl = this.canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "render.png";
        link.click();
    }
}
