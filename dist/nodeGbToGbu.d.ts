/**
 * Converts obj files to GB files.
 * The GB object will basically just contain a single mesh, no scene data
 *
 * @param input string destination of obj file to convert
 * @param output the name of the gbObject to be output
 */
export declare function nodeGbToGbu(input: string, output: string): Promise<void>;
