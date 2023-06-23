interface objParsedObject {
    position: Float32Array;
    normals: Float32Array;
    uv: Float32Array;
    indices: Uint16Array | Uint32Array;
}
export declare function parseObj(objStr: string): objParsedObject;
export {};
