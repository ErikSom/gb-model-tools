"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuffer = void 0;
const TypedMap = {
    5122: Int16Array,
    5123: Uint16Array,
    5124: Int32Array,
    5125: Uint32Array,
    5126: Float32Array,
};
const Type2NumOfComponent = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
};
function getBuffer(gltfRaw, accessorIndex, debug = false) {
    const accessor = gltfRaw.accessors[accessorIndex];
    const bufferView = gltfRaw.bufferViews[accessor.bufferView];
    const arrayBuffer = gltfRaw.realBuffers[bufferView.buffer];
    const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
    if (accessor.byteStride) {
        throw new Error('byteStride in buffer... not yet supported');
    }
    const TypeClass = TypedMap[accessor.componentType];
    // uint32... we do not support them just yet!
    // so we convert to a uint16
    if (accessor.componentType === 5125) {
        const uint32Array = new Uint32Array(arrayBuffer, byteOffset, accessor.count * Type2NumOfComponent[accessor.type]);
        return uint32Array;
    }
    return new TypeClass(arrayBuffer, byteOffset, accessor.count * Type2NumOfComponent[accessor.type]);
}
exports.getBuffer = getBuffer;
