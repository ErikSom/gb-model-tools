import { GBMaterial, GBObject } from '../../GBFormat';
import { GlTf, Material } from '../GLTFRaw';
export declare function rgb2hex(rgb: number[] | Float32Array): number;
export declare function processMaterial(rawMaterial: Material): GBMaterial;
export declare function processMaterials(gltfRaw: GlTf, gbObject: GBObject): void;
