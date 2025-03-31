"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
require('dotenv').config();
const client = mqtt_1.default.connect(`mqtt://${process.env.MQTT_BROKER}:${process.env.MQTT_PORT}`);
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(process.env.MQTT_TOPIC, (err) => {
        if (!err)
            console.log(`Subscribed to ${process.env.MQTT_TOPIC}`);
    });
});
exports.default = client;
