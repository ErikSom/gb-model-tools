"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeGltfToGb = void 0;
/* eslint-disable @typescript-eslint/no-use-before-define */
const fs = require("fs-extra");
const path_1 = require("path");
const batchGeometry_1 = require("./gb-compress/batchGeometry");
const compressGBObject_1 = require("./gb-compress/compressGBObject");
const dedupeGeometry_1 = require("./gb-compress/dedupeGeometry");
const gltfToGbParser_1 = require("./gltfToGb/gltfToGbParser");
const nodeDebugGb_1 = require("./nodeDebugGb");
const toArrayBuffer_1 = require("./utils/toArrayBuffer");
function nodeGltfToGb(input, output, options = {}) {
    return new Promise((resolve, reject) => {
        var _a;
        if (!input || !output) {
            reject(new Error('[nodeGltfToGb] both input and output parameters are required.'));
        }
        const json = fs.readJSONSync(input);
        const basePath = path_1.dirname(input);
        const buffers = json.buffers.map((buffer) => {
            const bufferData = fs.readFileSync(path_1.join(basePath, buffer.uri));
            return toArrayBuffer_1.toArrayBuffer(bufferData);
        });
        const gbObject = gltfToGbParser_1.gltfToGbParser(json, buffers);
        // remove any duplicate geometries..
        if (options.dedupe) {
            dedupeGeometry_1.dedupeGeometry(gbObject);
        }
        // then batch them up..
        if (options.batch) {
            batchGeometry_1.batchGeometry(gbObject);
        }
        const gbObjectCompressed = compressGBObject_1.compressGBObject(gbObject);
        fs.outputFileSync(output, new Float32Array(gbObjectCompressed));
        if (options.debug) {
            const debugPath = (_a = options.debugPath) !== null && _a !== void 0 ? _a : path_1.dirname(output);
            const debugFileName = path_1.basename(output).replace('.gb', '.json');
            nodeDebugGb_1.nodeDebugGb(output, path_1.join(debugPath, debugFileName))
                .then(resolve);
        }
        else {
            resolve();
        }
    });
}
exports.nodeGltfToGb = nodeGltfToGb;
