import { GBObject } from '../GBFormat';
/**
 * takes a gbObject and loops through the scene flattening everything into a single object.
 * this process will strip out any animation.
 * @param gbObject
 */
export declare function flattenScene(gbObject: GBObject): void;
