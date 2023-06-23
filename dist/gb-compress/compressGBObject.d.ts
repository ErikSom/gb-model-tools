import { GBObject } from '../GBFormat';
export declare const types: {
    UINT16: number;
    FLOAT32: number;
    STRING: number;
    FLOAT32_COMPRESSED: number;
    UINT16_COMPRESSED: number;
    UINT32: number;
    UINT32_COMPRESSED: number;
};
export declare function compressGBObject(gbObject: GBObject): ArrayBuffer;
