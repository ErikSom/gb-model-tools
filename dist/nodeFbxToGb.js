"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeFbxToGb = void 0;
const fs = require("fs-extra");
const path = require("path");
const nodeGltfToGb_1 = require("./nodeGltfToGb");
const convert = require("fbx2gltf");
/**
 * Converts a GLTF file to a GB file!
 *
 * it then converts gltf -> gb.
 *
 * @param {string} input the location of the gltf file we are to convert
 * @param {string} output the output location of the new GB object
 */
function nodeFbxToGb(input, output, options = {}) {
    return new Promise((resolve, reject) => {
        const basePath = './.gltf-temp/';
        const basename = path.basename(input, '.fbx');
        const outputFile = `${basePath}${basename}_out/${basename}.gltf`;
        const filename = `${basePath}${basename}.gltf`;
        fs.ensureDirSync(basePath);
        convert(input, filename).then(() => {
            nodeGltfToGb_1.nodeGltfToGb(outputFile, output, options);
            resolve();
            // yay, do what we will with our shiny new GLB file!
        }, (error) => {
            console.log('failed to convert to gltf...', error);
            reject();
            // ack, conversion failed: inspect 'error' for details
        });
    });
}
exports.nodeFbxToGb = nodeFbxToGb;
