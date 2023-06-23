export interface Bounds {
    ranges: {
        min: number;
        max: number;
    }[];
    sizes: number[];
}
export declare function getBounds(data: number[] | Float32Array, size: number): Bounds;
