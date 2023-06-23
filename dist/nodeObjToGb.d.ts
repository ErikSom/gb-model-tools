import { GBOptions } from './nodeGltfToGb';
/**
 * Converts obj files to GB files.
 * The GB object will basically just contain a single mesh, no scene data
 *
 * @param input string destination of obj file to convert
 * @param output the name of the gbObject to be output
 * @param options GBOption settings object
 */
export declare function nodeObjToGb(input: string, output: string, options?: GBOptions): Promise<void>;
