import { Texture } from './gltfToGb/GLTFRaw';
export declare type flatBounds = [number, number, number, number, number, number];
export interface GBCamera {
    fov: number;
    near: number;
    far: number;
    aspectRatio: number;
    mode: 0 | 1;
}
export interface GBGeometry {
    name: string;
    primitives: Array<GBPrimitive | GBPrimitiveFragment>;
    weights?: number[];
}
export interface GBTargets {
    positions?: Float32Array;
    normals?: Float32Array;
}
export interface GBPrimitiveFragment {
    bounds: flatBounds;
    material?: number;
    geometry: number;
    start: number;
    size: number;
}
export interface GBPrimitive {
    bounds: flatBounds;
    attributes: GBAttributes;
    indices?: Uint16Array | Uint32Array;
    material?: number;
    targets?: GBTargets[];
}
export interface GBAttributes {
    positions: Float32Array;
    normals?: Float32Array;
    uvs?: Float32Array;
    weights?: Float32Array;
    tangents?: Float32Array;
    boneIndices?: Float32Array;
}
export interface GBLight {
    name?: string;
    intensity: number;
    color: number;
    type: 0 | 1 | 2;
}
export interface GBTexture {
    uri: string;
}
export interface GBMaterial<T = number | Texture> {
    name?: string;
    state?: {
        blendMode: number;
        culling: boolean;
    };
    pbr?: {
        metallic: number;
        roughness: number;
        metallicRoughnessMap?: T;
    };
    standard?: {
        alpha?: number;
        color?: number;
        normalMap?: T;
        diffuseMap?: T;
        occlusionMap?: T;
        emissiveColor?: number;
        emissiveMap?: T;
    };
}
export interface GBNode {
    name: string;
    children: number[];
    transform: Float32Array;
    geometry?: number;
    skin?: number;
    type?: 'bone' | 'model' | 'light' | 'camera';
    light?: number;
    camera?: number;
    bindMatrix?: Float32Array;
    inverseBindMatrix?: Float32Array;
}
export interface GBScene {
    name: string;
    children: number[];
}
export interface GBSkin {
    bindMatrix: Float32Array;
    joints: number[];
}
export interface GBTrack {
    times: number[];
    values: number[];
}
export interface GBAnimation {
    name?: string;
    data: {
        duration: number;
        id: number;
        r?: GBTrack;
        t?: GBTrack;
        s?: GBTrack;
        w?: GBTrack;
    }[];
}
export interface GBObject {
    geometryBatch?: GBPrimitive[];
    geometry?: GBGeometry[];
    nodes?: GBNode[];
    scenes?: GBScene[];
    materials?: GBMaterial[];
    skins?: GBSkin[];
    animations?: GBAnimation[];
    lights?: GBLight[];
    cameras?: GBCamera[];
    textures?: GBTexture[];
}
