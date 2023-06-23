"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeObjToGb = void 0;
const fs = require("fs-extra");
const path_1 = require("path");
const compressGBObject_1 = require("./gb-compress/compressGBObject");
const nodeDebugGb_1 = require("./nodeDebugGb");
const objToGbParser_1 = require("./objToGb/objToGbParser");
/**
 * Converts obj files to GB files.
 * The GB object will basically just contain a single mesh, no scene data
 *
 * @param input string destination of obj file to convert
 * @param output the name of the gbObject to be output
 * @param options GBOption settings object
 */
function nodeObjToGb(input, output, options = {}) {
    return new Promise((resolve, reject) => {
        var _a;
        if (!input || !output) {
            reject(new Error('[nodeObjToGb] both input and output parameters are required.'));
        }
        const objRaw = fs.readFileSync(input, 'utf8');
        const name = path_1.basename(input, '.obj');
        const gbObject = objToGbParser_1.objToGbParser(objRaw, name);
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
exports.nodeObjToGb = nodeObjToGb;
