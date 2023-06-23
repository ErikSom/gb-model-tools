import { GBPrimitiveFragment, GBTargets, flatBounds } from './GBFormat';
/**
 * compressed objects are here to make TS work correctly with the way we compress a GB object
 * the reason being is that a GBObject is only ever worked with in an uncompressed state and I did not want to
 * complicate the TS declarations when working with the GBFormat.
 */
export declare type CompressibleFloat32Array = Float32Array | number;
export declare type CompressibleUint16Array = Uint16Array | number;
export declare type CompressibleUint32Array = Uint32Array | number;
export declare type CompressibleArray = number[] | number;
export interface GBPrimitiveCompressed {
    bounds: flatBounds;
    attributes: GBAttributesCompressed;
    indices?: CompressibleUint16Array | CompressibleUint32Array;
    material?: number;
    targets?: GBTargets[];
}
export interface GBGeometryCompressed {
    name: string;
    primitives: Array<GBPrimitiveCompressed | GBPrimitiveFragment>;
}
export interface GBAttributesCompressed {
    positions: CompressibleFloat32Array;
    normals?: CompressibleFloat32Array;
    uvs?: CompressibleFloat32Array;
    weights?: CompressibleFloat32Array;
    tangents?: CompressibleFloat32Array;
    boneIndices?: CompressibleFloat32Array;
}
export interface GBNodeCompressed {
    name: string;
    children: number[];
    transform: CompressibleFloat32Array;
    geometry?: number;
    skin?: number;
    type?: 'bone' | 'model' | 'light' | 'camera';
    light?: number;
    camera?: number;
    bindMatrix?: CompressibleFloat32Array;
    inverseBindMatrix?: CompressibleFloat32Array;
}
export interface GBSkinCompressed {
    bindMatrix: CompressibleFloat32Array;
    joints: number[];
}
