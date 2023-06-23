import { GBOptions } from './nodeGltfToGb';
/**
 * Converts a GLTF file to a GB file!
 *
 * it then converts gltf -> gb.
 *
 * @param {string} input the location of the gltf file we are to convert
 * @param {string} output the output location of the new GB object
 */
export declare function nodeFbxToGb(input: string, output: string, options?: GBOptions): Promise<void>;
