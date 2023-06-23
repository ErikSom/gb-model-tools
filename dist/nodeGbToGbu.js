"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeGbToGbu = void 0;
const fs = require("fs-extra");
const path_1 = require("path");
const compressGBObject_1 = require("./gb-compress/compressGBObject");
const objToGbParser_1 = require("./objToGb/objToGbParser");
/**
 * Converts obj files to GB files.
 * The GB object will basically just contain a single mesh, no scene data
 *
 * @param input string destination of obj file to convert
 * @param output the name of the gbObject to be output
 */
function nodeGbToGbu(input, output) {
    return new Promise((resolve) => {
        const objRaw = fs.readFileSync(input, 'utf8');
        const name = path_1.basename(input, '.obj');
        const gbObject = objToGbParser_1.objToGbParser(objRaw, name);
        const gbObjectCompressed = compressGBObject_1.compressGBObject(gbObject);
        fs.outputFileSync(output || './test/working-model.gb', new Float32Array(gbObjectCompressed));
        resolve();
    });
}
exports.nodeGbToGbu = nodeGbToGbu;
