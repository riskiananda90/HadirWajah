import { Server } from "socket.io";

let ioInstance: Server;

export const setupSocket = (io: Server) => {
  ioInstance = io;
  io.on("connection ", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
  });
};

export const emitOtpReceived = (studentId: number, otp: string) => {
  console.log(`Emitting otp to ${studentId}`);
  ioInstance.emit(`otp-${studentId}`, otp);
};
