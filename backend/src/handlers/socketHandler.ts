import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export function setupSocket(server: HttpServer): void {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Allow your frontend origin
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Frontend connected:', socket.id);
    socket.on('disconnect', () => console.log('Frontend disconnected:', socket.id));
  });
}

export function emit(event: string, data: any): void {
  if (io) {
    io.emit(event, data);
    console.log(`Emitted event: ${event}`, data); // Debug log
  }
}