import * as THREE from "three";

export class AppModel {
    imageDataUrl: string | null = null;
    texture: THREE.Texture | null = null;
    imageAspect = 1;

    renderWidth = 1;
    renderHeight = 1;

    disposeTexture(): void {
        if (this.texture) this.texture.dispose();
        this.texture = null;
    }
}
