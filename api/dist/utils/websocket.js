"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWebSocketServer = void 0;
const ws_1 = require("ws");
const ioredis_1 = __importDefault(require("ioredis"));
const startWebSocketServer = () => {
    const wss = new ws_1.WebSocketServer({ port: 8080 });
    const redisSub = new ioredis_1.default();
    redisSub.subscribe('processed_data', (err, count) => {
        if (err) {
            console.error('Failed to subscribe:', err);
        }
        else {
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
exports.startWebSocketServer = startWebSocketServer;
