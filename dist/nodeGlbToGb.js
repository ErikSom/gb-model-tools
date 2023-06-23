"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeGlbToGb = void 0;
const fs = require("fs-extra");
const path = require("path");
const nodeGltfToGb_1 = require("./nodeGltfToGb");
const gltf_pipeline_1 = require("gltf-pipeline");
/**
 * Converts a GLB file to a GB file!
 *
 * basically it uses gltfpipeline to convert glb to a gltf
 * it then converts gltf -> gb.
 *
 * @param {string} input the location of the glb file we are to convert
 * @param {string} output the output location of the new GB object
 */
function nodeGlbToGb(input, output, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!input || !output) {
            throw new Error('[nodeGlbToGb] both input and output parameters are required.');
        }
        const basePath = './.gltf-temp/';
        fs.ensureDirSync(basePath);
        const glb = fs.readFileSync(input);
        const gltfResults = yield gltf_pipeline_1.glbToGltf(glb, { separate: true });
        const basename = path.basename(input, '.glb');
        const outPath = path.join(basePath, `${basename}_out`);
        fs.ensureDirSync(outPath);
        for (const i in gltfResults.separateResources) {
            const resource = gltfResults.separateResources[i];
            fs.writeFileSync(path.join(outPath, i), resource);
        }
        const gltfPath = path.join(outPath, `${basename}.gltf`);
        fs.writeJsonSync(gltfPath, gltfResults.gltf);
        return nodeGltfToGb_1.nodeGltfToGb(gltfPath, output, options);
    });
}
exports.nodeGlbToGb = nodeGlbToGb;
