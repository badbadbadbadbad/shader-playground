import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import GUI from "lil-gui";

import { PIPELINES, PIPELINE_LIST } from "../shaders/pipelines/PipelineRegistry.ts";
import { PIPELINE_IDS, type PipelineId } from "../shaders/pipelines/PipelineId.ts";

type BuiltPass = { effect: any; pass: any };

type Dependencies = {
    createComposer?: (renderer: THREE.WebGLRenderer) => any;
    createRenderPass?: (scene: THREE.Scene, camera: THREE.Camera) => any;
    createShaderPass?: (config: any) => any;
    createGui?: () => any;
    cloneUniforms?: (uniforms: any) => any;
    pipelines?: typeof PIPELINES;
    pipelineList?: typeof PIPELINE_LIST;
};

export class PipelineController {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.Camera;
    private readonly canvas: HTMLCanvasElement;

    private readonly dependencies: Required<Dependencies>;

    private inputTexture: THREE.Texture | null = null;
    private composer: any;
    private gui: any;

    private activeId: PipelineId = PIPELINE_IDS.ANISOTROPIC_KUWAHARA;
    private guiState: { activePipeline: PipelineId } = {
        activePipeline: PIPELINE_IDS.ANISOTROPIC_KUWAHARA,
    };

    private renderSize = { width: 1, height: 1 };
    private built: BuiltPass[] = [];

    constructor(
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
        camera: THREE.Camera,
        dependencies: Dependencies = {}
    ) {
        this.scene = scene;
        this.camera = camera;
        this.canvas = renderer.domElement;

        this.dependencies = {
            createComposer: dependencies.createComposer ?? ((renderer) => new EffectComposer(renderer)),
            createRenderPass: dependencies.createRenderPass ?? ((scene, camera) => new RenderPass(scene, camera as any)),
            createShaderPass: dependencies.createShaderPass ?? ((config) => new ShaderPass(config)),
            createGui: dependencies.createGui ?? (() => new GUI()),
            cloneUniforms: dependencies.cloneUniforms ?? ((uniform) => THREE.UniformsUtils.clone(uniform)),
            pipelines: dependencies.pipelines ?? PIPELINES,
            pipelineList: dependencies.pipelineList ?? PIPELINE_LIST,
        };

        this.composer = this.dependencies.createComposer(renderer);
        this.gui = this.dependencies.createGui();
    }

    init(): void {
        this.setPipeline(this.activeId);
    }

    setSize(width: number, height: number): void {
        this.renderSize.width = width;
        this.renderSize.height = height;

        this.composer.setSize(width, height);

        for (const { pass } of this.built) {
            const uniforms = pass.uniforms;
            if (uniforms?.resolution?.value?.set) {
                uniforms.resolution.value.set(width, height);
            }
        }
    }

    setInputTexture(texture: THREE.Texture | null): void {
        this.inputTexture = texture;

        for (const { pass } of this.built) {
            const uniforms = pass.uniforms;
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

        this.composer.addPass(this.dependencies.createRenderPass(this.scene, this.camera));

        const pipeline = this.dependencies.pipelines[id];
        for (const effect of pipeline.effects) {
            const uniforms = this.dependencies.cloneUniforms(effect.uniforms);

            const pass = this.dependencies.createShaderPass({
                uniforms,
                vertexShader: effect.vertex,
                fragmentShader: effect.fragment,
            });

            if (pass.material) {
                pass.material.glslVersion = THREE.GLSL3;
                pass.material.needsUpdate = true;
            }

            this.composer.addPass(pass);
            this.built.push({ effect, pass });
        }

        this.rebuildGuiForPipeline();

        this.setSize(this.renderSize.width, this.renderSize.height);
        this.setInputTexture(this.inputTexture);
    }

    render(): void {
        this.composer.render();
    }

    private rebuildGuiForPipeline(): void {
        this.gui.destroy();
        this.gui = this.dependencies.createGui();

        this.gui.add({ downloadImage: () => this.downloadImage() }, "downloadImage").name("Download image");

        const options = Object.fromEntries(
            this.dependencies.pipelineList.map((pipeline) => [pipeline.label, pipeline.id])
        ) as Record<string, PipelineId>;

        this.gui
            .add(this.guiState, "activePipeline", options)
            .name("Pipeline")
            .onChange((value: PipelineId) => {
                this.setPipeline(value);
                this.render();
            });

        const settings = this.gui.addFolder("Settings");
        settings.open();

        settings.add({ reset: () => this.resetGuiUniformsToDefaults() }, "reset").name("Reset settings");

        for (const { effect, pass } of this.built) {
            if (!effect.buildGui) continue;

            const effectFolder = settings.addFolder(effect.label ?? effect.id);
            effectFolder.open();

            effect.buildGui(effectFolder, pass.uniforms, () => this.render(), effect);
        }
    }

    private downloadImage(): void {
        this.render();

        const dataUrl = this.canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "render.png";
        link.click();
    }

    private resetGuiUniformsToDefaults(): void {
        for (const { effect, pass } of this.built) {
            const passUniforms = pass.uniforms;
            const defaultUniforms = effect.uniforms;

            for (const key of Object.keys(passUniforms)) {
                const currentUniform = passUniforms[key];
                const defaultUniform = defaultUniforms?.[key];

                if (!currentUniform || !defaultUniform) continue;

                if (typeof currentUniform.value === "number" && typeof defaultUniform.value === "number") {
                    currentUniform.value = defaultUniform.value;
                }
            }
        }

        this.gui.controllersRecursive().forEach((controller: any) => controller.updateDisplay());

        this.render();
    }
}
