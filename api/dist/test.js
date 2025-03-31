"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ws = new ws_1.default('ws://localhost:8080');
ws.on('open', () => {
    console.log('Connected to WebSocket server');
});
ws.on('message', (data) => {
    const sensorData = JSON.parse(data);
    console.log('Received real-time data:');
    console.log(`Device ID: ${sensorData.deviceId}`);
    console.log(`Temperature: ${sensorData.temperature}°C`);
    console.log(`Humidity: ${sensorData.humidity}%`);
    console.log('------------------------');
});
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});
ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});
