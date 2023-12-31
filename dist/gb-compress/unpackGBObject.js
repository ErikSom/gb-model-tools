"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackGBObject = void 0;
const mat4_1 = require("../utils/mat4");
const compressArray_1 = require("./utils/compressArray");
const unpackGBMeta_1 = require("./unpackGBMeta");
const zipArray_1 = require("./utils/zipArray");
const compressGBObject_1 = require("./compressGBObject");
function unpackGBObject(buffer) {
    var _a, _b, _c, _d, _e;
    const { gbObject, buffers } = unpack(buffer);
    const animMap = {
        s: 3,
        t: 3,
        w: 1,
        r: 4,
    };
    const map = {
        positions: 3,
        normals: 3,
        weights: 4,
        boneIndices: 4,
        uvs: 2,
        tangents: 4,
    };
    (_a = gbObject.geometryBatch) === null || _a === void 0 ? void 0 : _a.forEach((primitive) => {
        if (primitive.indices !== undefined) {
            primitive.indices = buffers[Number(primitive.indices)];
        }
        for (const i in map) {
            if (primitive.attributes[i] !== undefined) {
                primitive.attributes[i] = buffers[primitive.attributes[i]];
            }
        }
    });
    (_b = gbObject.geometry) === null || _b === void 0 ? void 0 : _b.forEach((geom) => {
        geom.primitives.forEach((primitive) => {
            if (primitive.attributes) {
                if (primitive.indices !== undefined) {
                    primitive.indices = buffers[Number(primitive.indices)];
                }
                for (const i in map) {
                    if (primitive.attributes[i] !== undefined) {
                        primitive.attributes[i] = buffers[primitive.attributes[i]];
                    }
                }
            }
            if (primitive.targets) {
                primitive.targets.forEach((target) => {
                    for (const i in map) {
                        if (target[i] !== undefined) {
                            target[i] = buffers[target[i]];
                        }
                    }
                });
            }
        });
    });
    (_c = gbObject.animations) === null || _c === void 0 ? void 0 : _c.forEach((anim) => {
        anim.data.forEach((data) => {
            for (const i in animMap) {
                if (data[i]) {
                    data[i].times = buffers[data[i].times];
                    data[i].values = buffers[data[i].values];
                }
            }
        });
    });
    (_d = gbObject.nodes) === null || _d === void 0 ? void 0 : _d.forEach((node) => {
        let bufferId = Number(node.bindMatrix);
        node.bindMatrix = (bufferId === -1) ? mat4_1.createMat4() : buffers[bufferId];
        bufferId = Number(node.inverseBindMatrix);
        node.inverseBindMatrix = buffers[bufferId];
        bufferId = Number(node.transform);
        node.transform = (bufferId === -1) ? mat4_1.createMat4() : buffers[bufferId];
    });
    (_e = gbObject.skins) === null || _e === void 0 ? void 0 : _e.forEach((skin) => {
        const bufferId = Number(skin.bindMatrix);
        skin.bindMatrix = (bufferId === -1) ? mat4_1.createMat4() : buffers[bufferId];
    });
    return gbObject;
}
exports.unpackGBObject = unpackGBObject;
function unpack(buffer) {
    let index = 0;
    const float32View = new Float32Array(buffer);
    const size = float32View[index++];
    index++;
    // const type = float32View[index++];
    index += size / 2;
    if (index % 1) {
        index += 0.5;
    }
    const gbObject = unpackGBMeta_1.unpackGBMeta(buffer);
    const buffers = [];
    while (index < float32View.length - 1) {
        const size = float32View[index++];
        const type = float32View[index++];
        if (type === compressGBObject_1.types.FLOAT32) {
            buffers.push(new Float32Array(buffer, 4 * index, size));
            index += size;
        }
        else if (type === compressGBObject_1.types.FLOAT32_COMPRESSED || type === compressGBObject_1.types.UINT16_COMPRESSED || type === compressGBObject_1.types.UINT32_COMPRESSED) {
            const compressedData = new Uint8Array(buffer, 4 * index, size);
            const newCompressed = zipArray_1.unzipArray(compressedData.slice(0));
            const u16Buffer = new Uint16Array(newCompressed.buffer);
            if (type === compressGBObject_1.types.FLOAT32_COMPRESSED) {
                const newBuffer = compressArray_1.unpackArray(u16Buffer);
                buffers.push(newBuffer);
            }
            else if (type === compressGBObject_1.types.UINT16_COMPRESSED) {
                buffers.push(u16Buffer);
            }
            else if (type === compressGBObject_1.types.UINT32_COMPRESSED) {
                buffers.push(new Uint32Array(newCompressed.buffer));
            }
            index += size / 4;
            index += 1 - (index % 1);
        }
        else if (type === compressGBObject_1.types.UINT16) {
            buffers.push(new Uint16Array(buffer, 4 * index, size));
            index += size / 2;
            if (index % 1) {
                index += 0.5;
            }
        }
        else if (type === compressGBObject_1.types.UINT32) {
            buffers.push(new Uint32Array(buffer, 4 * index, size));
            index += size;
        }
        else {
            throw new Error(`not supported buffer,${type}`);
        }
    }
    return { gbObject, buffers };
}
