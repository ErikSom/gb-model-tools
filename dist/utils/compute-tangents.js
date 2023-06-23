"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeTangents = void 0;
const vec3 = require("./vec3");
// TODO refactor and remove
// TODO figure out.. do we need this?
// can 3D modelers just add them to the model?
// or calculate them at runtime? (currently we do that!)
/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mat Groves
 *
 * Thanks again three.js, modified to use gl-matrix
 *
 */
function fromArray(out, from, index) {
    for (let i = 0; i < out.length; i++) {
        out[i] = from[index + i];
    }
}
function set(out, value1, value2, value3) {
    out[0] = value1;
    out[1] = value2;
    out[2] = value3;
}
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
function computeTangents(geometry) {
    // we already have tangents!
    if (geometry.attributes.tangents) {
        return;
    }
    const indices = geometry.indices;
    const positions = geometry.attributes.positions;
    const normals = geometry.attributes.normals;
    const uvs = geometry.attributes.uvs;
    if (!indices || !normals || !uvs || !positions) {
        // eslint-disable-next-line max-len
        throw new Error('gb-tools cannot compute tangents, missing one or more required attributes (uvs, positions, normals, indices');
    }
    const nVertices = positions.length / 3;
    const tangents = new Float32Array(4 * nVertices); // attributes.tangent.array;
    geometry.attributes.tangents = tangents;
    const tan1 = [];
    const tan2 = [];
    for (let i = 0; i < nVertices; i++) {
        tan1[i] = new Float32Array(3);
        tan2[i] = new Float32Array(3);
    }
    const vA = new Float32Array(3);
    const vB = new Float32Array(3);
    const vC = new Float32Array(3);
    const uvA = new Float32Array(2);
    const uvB = new Float32Array(2);
    const uvC = new Float32Array(2);
    const sDir = new Float32Array(3);
    const tDir = new Float32Array(3);
    const handleTriangle = (a, b, c) => {
        fromArray(vA, positions, a * 3);
        fromArray(vB, positions, b * 3);
        fromArray(vC, positions, c * 3);
        fromArray(uvA, uvs, a * 2);
        fromArray(uvB, uvs, b * 2);
        fromArray(uvC, uvs, c * 2);
        const x1 = vB[0] - vA[0];
        const x2 = vC[0] - vA[0];
        const y1 = vB[1] - vA[1];
        const y2 = vC[1] - vA[1];
        const z1 = vB[2] - vA[2];
        const z2 = vC[2] - vA[2];
        const s1 = uvB[0] - uvA[0];
        const s2 = uvC[0] - uvA[0];
        const t1 = uvB[1] - uvA[1];
        const t2 = uvC[1] - uvA[1];
        const r = 1.0 / ((s1 * t2) - (s2 * t1));
        set(sDir, ((t2 * x1) - (t1 * x2)) * r, ((t2 * y1) - (t1 * y2)) * r, ((t2 * z1) - (t1 * z2)) * r);
        set(tDir, ((s1 * x2) - (s2 * x1)) * r, ((s1 * y2) - (s2 * y1)) * r, ((s1 * z2) - (s2 * z1)) * r);
        vec3.add(tan1[a], tan1[a], sDir);
        vec3.add(tan1[b], tan1[b], sDir);
        vec3.add(tan1[c], tan1[c], sDir);
        vec3.add(tan2[a], tan2[a], tDir);
        vec3.add(tan2[b], tan2[b], tDir);
        vec3.add(tan2[c], tan2[c], tDir);
    };
    const group = {
        start: 0,
        count: indices.length,
    };
    const start = group.start;
    const count = group.count;
    for (let j = start, jl = start + count; j < jl; j += 3) {
        handleTriangle(indices[j + 0], indices[j + 1], indices[j + 2]);
    }
    const tmp = new Float32Array(3);
    const tmp2 = new Float32Array(3);
    const n = new Float32Array(3);
    const n2 = new Float32Array(3);
    let w;
    let t;
    let test;
    const handleVertex = (v) => {
        fromArray(n, normals, v * 3);
        vec3.copy(n2, n);
        t = tan1[v];
        // Gram-Schmidt orthogonalize
        vec3.copy(tmp, t);
        vec3.sub(tmp, tmp, vec3.scale(n, n, vec3.dot(n, t)));
        vec3.normalize(tmp, tmp);
        // Calculate handedness
        vec3.cross(tmp2, n2, t);
        test = vec3.dot(tmp2, tan2[v]);
        w = (test < 0.0) ? -1.0 : 1.0;
        tangents[v * 4] = tmp[0];
        tangents[(v * 4) + 1] = tmp[1];
        tangents[(v * 4) + 2] = tmp[2];
        tangents[(v * 4) + 3] = w;
    };
    for (let j = start, jl = start + count; j < jl; j += 3) {
        handleVertex(indices[j + 0]);
        handleVertex(indices[j + 1]);
        handleVertex(indices[j + 2]);
    }
}
exports.computeTangents = computeTangents;
