"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeDebugGb = void 0;
const fs = require("fs-extra");
const path_1 = require("path");
const toArrayBuffer_1 = require("./utils/toArrayBuffer");
const unpackGBMeta_1 = require("./gb-compress/unpackGBMeta");
/**
 * Converts obj files to GB files.
 * The GB object will basically just contain a single mesh, no scene data
 *
 * @param input string destination of obj file to convert
 * @param output the name of the gbObject to be output
 */
function nodeDebugGb(input, output) {
    return new Promise((resolve) => {
        const gbObjectCompressed = toArrayBuffer_1.toArrayBuffer(fs.readFileSync(input));
        const meta = unpackGBMeta_1.unpackGBMeta(gbObjectCompressed);
        fs.ensureDirSync(path_1.dirname(output));
        fs.writeJSONSync(output, meta, { spaces: '    ' });
        resolve();
    });
}
exports.nodeDebugGb = nodeDebugGb;
