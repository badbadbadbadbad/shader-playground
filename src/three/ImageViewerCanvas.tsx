import * as THREE from "three";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Canvas, useThree} from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

import { ImagePlane } from "./ImagePlane";
import { type Size2D, useFittedSize } from "./useFittedSize";

type ImageViewerCanvasProps = {
    imageUrl: string;
    imageAspectRatio: number;
    showBorder?: boolean;
    onClick?: () => void;
    onHoverChange?: (isHovered: boolean) => void;
};

function DemandInvalidateOnResize(props: { width: number; height: number }) {
    const { invalidate } = useThree();

    useEffect(() => {
        invalidate();
    }, [props.width, props.height, invalidate]);

    return null;
}

export function ImageViewerCanvas({
                                      imageUrl,
                                      imageAspectRatio,
                                      showBorder = true,
                                      onClick,
                                      onHoverChange,
                                  }: ImageViewerCanvasProps) {
    const [availableSpaceElement, setAvailableSpaceElement] = useState<HTMLDivElement | null>(null);

    const setAvailableSpaceRef = useCallback((element: HTMLDivElement | null) => {
        setAvailableSpaceElement(element);
    }, []);

    const fittedSizeRaw: Size2D = useFittedSize(availableSpaceElement, imageAspectRatio);
    const fittedSize = useMemo<Size2D>(() => {
        const safeWidth = Number.isFinite(fittedSizeRaw.width) ? Math.max(2, fittedSizeRaw.width) : 2;
        const safeHeight = Number.isFinite(fittedSizeRaw.height) ? Math.max(2, fittedSizeRaw.height) : 2;
        return { width: safeWidth, height: safeHeight };
    }, [fittedSizeRaw.width, fittedSizeRaw.height]);

    const fittedWrapperStyle = useMemo<React.CSSProperties>(() => {
        return {
            width: `${Math.max(1, Math.round(fittedSize.width))}px`,
            height: `${Math.max(1, Math.round(fittedSize.height))}px`,
            border: showBorder ? "2px solid #b1acc7" : undefined,
            borderRadius: "5px",
            boxSizing: "border-box",
        };
    }, [fittedSize.width, fittedSize.height, showBorder]);

    const canvasStyle = useMemo<React.CSSProperties>(() => {
        return {
            width: "100%",
            height: "100%",
            display: "block",
            borderRadius: "5px",
        };
    }, []);

    return (
        <div
            ref={setAvailableSpaceRef}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={fittedWrapperStyle} onClick={onClick}>
                {availableSpaceElement && (
                    <Canvas
                        frameloop="demand"
                        gl={{ preserveDrawingBuffer: true, antialias: true }}
                        style={canvasStyle}
                        onCreated={({ scene, gl }) => {
                            scene.background = new THREE.Color(0x1c1c1f);
                            gl.setClearColor(0x1c1c1f, 1);
                        }}
                    >
                        <OrthographicCamera
                            makeDefault
                            near={1}
                            far={1000}
                            position={[0, 0, 1]}
                            left={-fittedSize.width / 2}
                            right={fittedSize.width / 2}
                            top={fittedSize.height / 2}
                            bottom={-fittedSize.height / 2}
                        />

                        <DemandInvalidateOnResize width={fittedSize.width} height={fittedSize.height} />

                        <ImagePlane
                            imageUrl={imageUrl}
                            planeWidth={fittedSize.width}
                            planeHeight={fittedSize.height}
                            onClick={onClick}
                            onHoverChange={onHoverChange}
                        />
                    </Canvas>
                )}
            </div>
        </div>
    );
}
