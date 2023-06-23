"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = exports.copy = exports.scale = exports.sub = exports.dot = exports.normalize = exports.cross = exports.clone = exports.create = void 0;
/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
    return new Float32Array(3);
}
exports.create = create;
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
    const out = new Float32Array(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}
exports.clone = clone;
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    out[0] = (ay * bz) - (az * by);
    out[1] = (az * bx) - (ax * bz);
    out[2] = (ax * by) - (ay * bx);
    return out;
}
exports.cross = cross;
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    let len = (x * x) + (y * y) + (z * z);
    if (len > 0) {
        // TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
}
exports.normalize = normalize;
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
}
exports.dot = dot;
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function sub(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
}
exports.sub = sub;
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
}
exports.scale = scale;
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}
exports.copy = copy;
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
}
exports.add = add;
