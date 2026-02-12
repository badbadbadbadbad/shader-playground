import * as THREE from "three";
import type { ImageModel } from "../model/ImageModel.ts";

const HEX_BORDER = "#b1acc7";

export type ThreeCanvasBaseDependencies = {
    createScene?: () => THREE.Scene;
    createColor?: (hex: number) => THREE.Color;
    createPlaneGeometry?: (width: number, height: number) => THREE.PlaneGeometry;
    createMeshBasicMaterial?: (params: { color: number }) => THREE.MeshBasicMaterial;
    createMesh?: (
        geometry: THREE.PlaneGeometry,
        material: THREE.MeshBasicMaterial
    ) => THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    createOrthographicCamera?: (
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number
    ) => THREE.OrthographicCamera;
    createWebGLRenderer?: (params: {
        preserveDrawingBuffer: boolean;
        antialias: boolean;
        powerPreference: "high-performance";
    }) => THREE.WebGLRenderer;
};

export abstract class ThreeCanvasBase {
    protected readonly host: HTMLElement;
    protected readonly model: ImageModel;
    protected readonly dependencies: Required<ThreeCanvasBaseDependencies>;

    protected scene!: THREE.Scene;
    protected camera!: THREE.OrthographicCamera;
    protected renderer!: THREE.WebGLRenderer;

    protected plane!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

    constructor(host: HTMLElement, model: ImageModel, dependencies: ThreeCanvasBaseDependencies = {}) {
        this.host = host;
        this.model = model;

        this.dependencies = {
            createScene: dependencies.createScene ?? (() => new THREE.Scene()),
            createColor: dependencies.createColor ?? ((hex) => new THREE.Color(hex)),
            createPlaneGeometry: dependencies.createPlaneGeometry ?? ((width, height) => new THREE.PlaneGeometry(width, height)),
            createMeshBasicMaterial: dependencies.createMeshBasicMaterial ?? ((params) => new THREE.MeshBasicMaterial(params)),
            createMesh: dependencies.createMesh ?? ((geometry, material) => new THREE.Mesh(geometry, material)),
            createOrthographicCamera:
                dependencies.createOrthographicCamera ??
                ((left, right, top, bottom, near, far) => new THREE.OrthographicCamera(left, right, top, bottom, near, far)),
            createWebGLRenderer:
                dependencies.createWebGLRenderer ??
                ((params) => new THREE.WebGLRenderer(params)),
        };
    }

    init(): void {
        this.scene = this.dependencies.createScene();
        this.scene.background = this.dependencies.createColor(0x1c1c1f);

        const geometry = this.dependencies.createPlaneGeometry(1, 1);
        const material = this.dependencies.createMeshBasicMaterial({ color: 0x1c1c1f });
        this.plane = this.dependencies.createMesh(geometry, material);
        this.scene.add(this.plane);

        this.camera = this.dependencies.createOrthographicCamera(-1, 1, 1, -1, 1, 1000);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        this.renderer = this.dependencies.createWebGLRenderer({
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.NoToneMapping;
        this.renderer.domElement.style.border = `2px solid ${HEX_BORDER}`;
        this.renderer.domElement.style.borderRadius = "5px";
        this.host.appendChild(this.renderer.domElement);
    }

    update(): void {
        this.plane.scale.set(this.model.renderWidth, this.model.renderHeight, 1);

        if (this.model.texture) {
            const material = this.plane.material;

            if (material.map !== this.model.texture) {
                material.map = this.model.texture;
            }

            material.color.set(0xffffff);
            material.needsUpdate = true;
        }

        const width = this.model.renderWidth;
        const height = this.model.renderHeight;

        this.renderer.setSize(width, height, false);

        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();

        this.renderOnce();
    }

    protected renderOnce(): void {
        this.renderer.render(this.scene, this.camera);
    }

    destroy(): void {
        this.renderer?.dispose();
        this.plane.geometry.dispose();
        this.plane.material.dispose();
    }
}
