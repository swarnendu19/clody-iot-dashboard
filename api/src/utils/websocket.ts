import { WebSocketServer } from 'ws';
import Redis from 'ioredis';

export const startWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 8080 });
  const redisSub = new Redis();

  redisSub.subscribe('processed_data', (err, count) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    } else {
      console.log(`Subscribed to ${count} channel(s)`);
    }
  });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ message: 'Connected to WebSocket Server' }));
  });

  redisSub.on('message', (channel, message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
};