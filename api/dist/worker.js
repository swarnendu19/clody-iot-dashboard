"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redisSub = new ioredis_1.default();
const redisPub = new ioredis_1.default();
redisSub.subscribe('sensor_data', (err, count) => {
    if (err) {
        console.error('Failed to subscribe:', err);
    }
    else {
        console.log(`Subscribed to ${count} channel(s)`);
    }
});
redisSub.on('message', (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
    // For simplicity, pass data through; add processing logic later if needed
    redisPub.publish('processed_data', message);
});
