import { GBOptions } from './nodeGltfToGb';
/**
 * Converts a GLB file to a GB file!
 *
 * basically it uses gltfpipeline to convert glb to a gltf
 * it then converts gltf -> gb.
 *
 * @param {string} input the location of the glb file we are to convert
 * @param {string} output the output location of the new GB object
 */
export declare function nodeGlbToGb(input: string, output: string, options?: GBOptions): Promise<void>;
