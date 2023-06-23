import { GBPrimitive } from '../GBFormat';
/**
 * This will take a gbObject and compute the tangents attribute
 * Tangents are required if we want to use normal maps.
 * Not all models have this attribute data when they are exported
 * If successful a new `tangents` Float32Array will be attached to the gbObject
 *
 * indices, positions, normals and uvs are required to generate the tangents.
 *
 * This function is intended to be used at runtime by odie, but also I plan on pre generating these
 * in our 3d format as its seems like quite a lot of maths to do!
 *
 * @param geometry the gbObject that we want to add tangants to
 */
export declare function computeTangents(geometry: GBPrimitive): void;
