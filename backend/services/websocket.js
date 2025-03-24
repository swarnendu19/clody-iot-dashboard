const { WebSocketServer } = require('ws');
require('dotenv').config();

const wss = new WebSocketServer({ port: process.env.WS_PORT });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));
});

module.exports = wss;