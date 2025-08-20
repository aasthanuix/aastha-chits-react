import { Server } from 'socket.io';

let io;

export const initIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // TODO: restrict (e.g. ['http://localhost:5173'])
    },
  });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
