"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArrayBuffer = void 0;
function toArrayBuffer(myBuf) {
    const myBuffer = new ArrayBuffer(myBuf.length);
    const res = new Uint8Array(myBuffer);
    for (let i = 0; i < myBuf.length; ++i) {
        res[i] = myBuf[i];
    }
    return myBuffer;
}
exports.toArrayBuffer = toArrayBuffer;
