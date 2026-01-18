import * as THREE from "three";
import type { AppModel } from "../model/AppModel";

const HEX_BORDER = "#b1acc7";

export abstract class ThreeCanvasBase {
    protected readonly host: HTMLElement;
    protected readonly model: AppModel;

    protected scene!: THREE.Scene;
    protected camera!: THREE.OrthographicCamera;
    protected renderer!: THREE.WebGLRenderer;

    protected plane!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

    constructor(host: HTMLElement, model: AppModel) {
        this.host = host;
        this.model = model;
    }

    init(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1c1c1f);

        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x1c1c1f });
        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true, powerPreference: "high-performance" });
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.NoToneMapping;
        this.renderer.domElement.style.border = `2px solid ${HEX_BORDER}`;
        this.renderer.domElement.style.borderRadius = "5px";
        this.host.appendChild(this.renderer.domElement);
    }

    update(): void {
        this.plane.scale.set(this.model.renderWidth, this.model.renderHeight, 1);

        if (this.model.texture) {
            const mat = this.plane.material;

            if (mat.map !== this.model.texture) {
                mat.map = this.model.texture;
            }

            mat.color.set(0xffffff);
            mat.needsUpdate = true;
        }

        const w = this.model.renderWidth;
        const h = this.model.renderHeight;

        this.renderer.setSize(w, h, false);

        this.camera.left = -w / 2;
        this.camera.right = w / 2;
        this.camera.top = h / 2;
        this.camera.bottom = -h / 2;
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
