"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressGBObject = exports.types = void 0;
/* eslint-disable @typescript-eslint/no-use-before-define */
const compressArray_1 = require("./utils/compressArray");
const zipArray_1 = require("./utils/zipArray");
const compress = true;
exports.types = {
    UINT16: 0,
    FLOAT32: 1,
    STRING: 2,
    FLOAT32_COMPRESSED: 3,
    UINT16_COMPRESSED: 4,
    UINT32: 5,
    UINT32_COMPRESSED: 6,
};
// function constantTime(array)
// {
//     const diff = array[1] - array[0];
//     for (let i = 0; i < array.length - 1; i++)
//     {
//         const otherdiff = array[i + 1] - array[i];
//         if (Math.abs(otherdiff - diff) > 0.0001)
//         {
//             return false;
//         }
//     }
//     return true;
// }
function compressGBObject(gbObject) {
    // clone gBObject.
    var _a, _b, _c, _d, _e;
    const toConvert = [];
    const animMap = {
        s: 3,
        t: 3,
        r: 4,
        w: 1,
    };
    (_a = gbObject.animations) === null || _a === void 0 ? void 0 : _a.forEach((anim) => {
        anim.data.forEach((data) => {
            for (const i in animMap) {
                if (data[i]) {
                    // dataIsTheSame;
                    // const isConstant = constantTime(data[i].times);
                    //   console.log('>>>>>>>>>>>>>>>>>>>>>>', isConstant);
                    // if (!isConstant)
                    // {
                    toConvert.push({ compress: true, size: 1, buffer: data[i].times });
                    // }
                    data[i].times = toConvert.length - 1;
                    // console.log('-----> ', i, data[i].values.length);
                    toConvert.push({ compress: true, size: animMap[i], buffer: data[i].values });
                    data[i].values = toConvert.length - 1;
                }
            }
        });
    });
    const map = {
        positions: 3,
        normals: 3,
        weights: 4,
        boneIndices: 4,
        uvs: 2,
        indices: 1,
        tangents: 4,
    };
    const compressMap = {
        positions: true,
        normals: true,
        weights: true,
        boneIndices: true,
        uvs: true,
        tangents: true,
    };
    function packPrimitive(primitive) {
        for (const i in map) {
            if (primitive.attributes[i]) {
                toConvert.push({ compress: compressMap[i], size: map[i], buffer: primitive.attributes[i] });
                primitive.attributes[i] = toConvert.length - 1;
            }
        }
        if (primitive.indices) {
            // could be 16 OR 32..
            toConvert.push({ compress: true, size: 1, buffer: primitive.indices });
            primitive.indices = toConvert.length - 1;
        }
        if (primitive.targets) {
            primitive.targets.forEach((target) => {
                for (const i in map) {
                    if (target[i]) {
                        toConvert.push({ compress: compressMap[i], size: map[i], buffer: target[i] });
                        target[i] = toConvert.length - 1;
                    }
                }
            });
        }
    }
    (_b = gbObject.geometryBatch) === null || _b === void 0 ? void 0 : _b.forEach((primitive) => {
        packPrimitive(primitive);
    });
    (_c = gbObject.geometry) === null || _c === void 0 ? void 0 : _c.forEach((geom) => {
        geom.primitives.forEach((primitive) => {
            if (primitive.attributes) {
                packPrimitive(primitive);
            }
        });
    });
    (_d = gbObject.nodes) === null || _d === void 0 ? void 0 : _d.forEach((node) => {
        if (node.inverseBindMatrix) {
            if (node.inverseBindMatrix) {
                toConvert.push({ compress: false, size: 1, buffer: node.inverseBindMatrix });
                node.inverseBindMatrix = toConvert.length - 1;
            }
            else {
                node.inverseBindMatrix = -1;
            }
        }
        if (node.transform) {
            if (node.transform) {
                toConvert.push({ compress: false, size: 1, buffer: node.transform });
                node.transform = toConvert.length - 1;
            }
            else {
                node.transform = -1;
            }
        }
    });
    (_e = gbObject.skins) === null || _e === void 0 ? void 0 : _e.forEach((skin) => {
        if (skin.bindMatrix) {
            toConvert.push({ compress: false, size: 1, buffer: skin.bindMatrix });
            skin.bindMatrix = toConvert.length - 1;
        }
        else {
            skin.bindMatrix = -1;
        }
    });
    const buffer = pack(gbObject, toConvert);
    return buffer;
}
exports.compressGBObject = compressGBObject;
function pack(gbObject, toConvert) {
    const meta = JSON.stringify(gbObject);
    let metaByteLength = meta.length * 2 + 4 + 4;
    if (metaByteLength % 4) {
        metaByteLength += metaByteLength % 4;
    }
    // compress buffers..
    // add the meta...
    toConvert.forEach((data) => {
        // slice as this can come from the same buffer...
        const buffer = data.buffer.slice(0);
        if (compress && data.compress) {
            if (buffer instanceof Float32Array) {
                data.compressed = compressArray_1.compressArray(buffer, data.size || 1);
            }
            else {
                data.compressed = buffer;
            }
            data.compressed = zipArray_1.zipArray(data.compressed);
        }
    });
    let byteLength = toConvert.reduce((size, data) => {
        // add type and size (4, 4)
        size += 4 + 4;
        if (data.compressed) {
            // compressed...
            const compressedSize = data.compressed.buffer.byteLength;
            size += compressedSize + (4 - (compressedSize % 4));
        }
        else {
            size += data.buffer.buffer.byteLength;
        }
        return size;
    }, metaByteLength);
    byteLength += 4 - (byteLength % 4);
    const output = new ArrayBuffer(byteLength);
    const float32View = new Float32Array(output);
    const uint16View = new Uint16Array(output);
    const uint32View = new Uint32Array(output);
    const uint8View = new Uint8Array(output);
    let index = 0;
    float32View[index++] = meta.length;
    float32View[index++] = exports.types.STRING;
    const size = meta.length;
    for (let i = 0; i < size; i++) {
        uint16View[index * 2] = meta.charCodeAt(i);
        index += 0.5;
    }
    if (index % 1 !== 0) {
        index += 0.5;
    }
    // console.log(index);
    toConvert.forEach((data) => {
        const buffer = data.buffer;
        if (buffer instanceof Uint16Array) {
            if (data.compressed) {
                float32View[index++] = data.compressed.length;
                float32View[index++] = exports.types.UINT16_COMPRESSED;
                const compressedData = data.compressed;
                for (let i = 0; i < compressedData.length; i++) {
                    uint8View[index * 4] = compressedData[i];
                    index += 0.25;
                }
                index += 1 - (index % 1);
            }
            else {
                float32View[index++] = buffer.length;
                float32View[index++] = exports.types.UINT16;
                for (let i = 0; i < buffer.length; i++) {
                    uint16View[index * 2] = buffer[i];
                    index += 0.5;
                }
                index += index % 1;
            }
        }
        else if (buffer instanceof Uint32Array) {
            if (data.compressed) {
                float32View[index++] = data.compressed.length;
                float32View[index++] = exports.types.UINT32_COMPRESSED;
                const compressedData = data.compressed;
                for (let i = 0; i < compressedData.length; i++) {
                    uint8View[index * 4] = compressedData[i];
                    index += 0.25;
                }
                index += 1 - (index % 1);
            }
            else {
                float32View[index++] = buffer.length;
                float32View[index++] = exports.types.UINT32;
                for (let i = 0; i < buffer.length; i++) {
                    uint32View[index++] = buffer[i];
                }
            }
        }
        else if (buffer instanceof Float32Array) {
            if (data.compressed) {
                float32View[index++] = data.compressed.length;
                float32View[index++] = exports.types.FLOAT32_COMPRESSED;
                const compressedData = data.compressed;
                for (let i = 0; i < compressedData.length; i++) {
                    uint8View[index * 4] = compressedData[i];
                    index += 0.25;
                }
                index += 1 - (index % 1);
            }
            else {
                float32View[index++] = buffer.length;
                float32View[index++] = exports.types.FLOAT32;
                for (let i = 0; i < buffer.length; i++) {
                    float32View[index++] = buffer[i];
                }
            }
        }
    });
    return output;
}
