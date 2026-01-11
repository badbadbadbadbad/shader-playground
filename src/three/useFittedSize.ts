import { useEffect, useMemo, useState } from "react";

export type Size2D = { width: number; height: number };

/**
 * Observes an element and returns its current pixel size.
 * Uses ResizeObserver so it reacts to window resizes *and* layout/CSS changes.
 */
export function useElementSize(element: HTMLElement | null): Size2D {
    const [size, setSize] = useState<Size2D>({ width: 1, height: 1 });

    useEffect(() => {
        if (!element) return;

        let frameId: number | null = null;

        const updateSize = () => {
            frameId = null;
            const width = element.clientWidth || 1;
            const height = element.clientHeight || 1;
            setSize((previous) => {
                if (previous.width === width && previous.height === height) return previous;
                return { width, height };
            });
        };

        const scheduleUpdate = () => {
            if (frameId != null) return;
            frameId = window.requestAnimationFrame(updateSize);
        };

        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(element);

        scheduleUpdate();

        return () => {
            resizeObserver.disconnect();
            if (frameId != null) window.cancelAnimationFrame(frameId);
        };
    }, [element]);

    return size;
}

/**
 * Computes the largest rectangle (width/height) that fits inside the container
 * while preserving the image aspect ratio.
 *
 * imageAspectRatio = imageWidth / imageHeight
 */
export function computeFittedSize(
    containerWidth: number,
    containerHeight: number,
    imageAspectRatio: number
): Size2D {
    const safeContainerWidth = Math.max(1, containerWidth);
    const safeContainerHeight = Math.max(1, containerHeight);

    const containerAspectRatio = safeContainerWidth / safeContainerHeight;
    const safeImageAspectRatio = imageAspectRatio > 0 ? imageAspectRatio : 1;

    // If the image is "wider" than the container, it will hit left/right first.
    if (safeImageAspectRatio >= containerAspectRatio) {
        const width = safeContainerWidth;
        const height = width / safeImageAspectRatio;
        return { width, height };
    } else {
        // Otherwise it will hit top/bottom first.
        const height = safeContainerHeight;
        const width = height * safeImageAspectRatio;
        return { width, height };
    }
}

export function useFittedSize(element: HTMLElement | null, imageAspectRatio: number): Size2D {
    const { width: containerWidth, height: containerHeight } = useElementSize(element);

    return useMemo(() => {
        return computeFittedSize(containerWidth, containerHeight, imageAspectRatio);
    }, [containerWidth, containerHeight, imageAspectRatio]);
}