import * as THREE from "three";
import {useLoader, useThree} from "@react-three/fiber";
import {useEffect} from "react";

type ImagePlaneProps = {
    imageUrl: string;
    planeWidth: number;
    planeHeight: number;
    onClick?: () => void;
    onHoverChange?: (isHovered: boolean) => void;
};

export function ImagePlane({
                               imageUrl,
                               planeWidth,
                               planeHeight,
                               onClick,
                               onHoverChange,
                           }: ImagePlaneProps) {
    const texture = useLoader(THREE.TextureLoader, imageUrl);
    const { invalidate } = useThree();

    useEffect(() => {
        invalidate();
    }, [texture, invalidate]);

    return (
        <mesh
            scale={[planeWidth, planeHeight, 1]}
            onPointerDown={() => onClick?.()}
            onPointerOver={() => onHoverChange?.(true)}
            onPointerOut={() => onHoverChange?.(false)}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                map={texture}
                map-colorSpace={THREE.SRGBColorSpace}
            />
        </mesh>
    );
}