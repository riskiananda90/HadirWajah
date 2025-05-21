"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitOtpReceived = exports.setupSocket = void 0;
let ioInstance;
const setupSocket = (io) => {
    ioInstance = io;
    io.on("connection ", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
    });
};
exports.setupSocket = setupSocket;
const emitOtpReceived = (studentId, otp) => {
    console.log(`Emitting otp to ${studentId}`);
    ioInstance.emit(`otp-${studentId}`, otp);
};
exports.emitOtpReceived = emitOtpReceived;
