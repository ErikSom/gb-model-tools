export interface GBOptions {
    dedupe?: boolean;
    batch?: boolean;
    debug?: boolean;
    debugPath?: string;
}
export declare function nodeGltfToGb(input: string, output: string, options?: GBOptions): Promise<void>;
