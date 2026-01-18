import * as THREE from "three";

export function isImage(file: File): boolean {
    const allowed = [
        "image/jpeg",
        "image/png",
        "image/avif",
        "image/bmp",
        "image/gif",
        "image/webp",
    ];
    return allowed.includes(file.type);
}

export function readImageAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", () => resolve(String(reader.result)));
        reader.addEventListener("error", reject);
        reader.readAsDataURL(file);
    });
}

export function getImageAspectFromTexture(tex: THREE.Texture): number {
    const img = tex.image;

    if (img && typeof img === "object" && "width" in img && "height" in img) {
        const w = Number((img as any).width);
        const h = Number((img as any).height);
        if (Number.isFinite(w) && Number.isFinite(h) && h > 0) return w / h;
    }

    return 1;
}

export function fitRect(containerWidth: number, containerHeight: number, imageAspectRatio: number) {
    const canvasAspect = containerWidth / containerHeight;

    let width: number, height: number;
    if (imageAspectRatio >= canvasAspect) {
        width = containerWidth;
        height = width / imageAspectRatio;
    } else {
        height = containerHeight;
        width = height * imageAspectRatio;
    }
    return { w: width, h: height };
}