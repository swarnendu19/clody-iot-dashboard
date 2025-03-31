"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
// Configuration
const mqttServer = 'mqtt://test.mosquitto.org';
const mqttTopic = 'sensor/data/my_test_123'; // Use a unique key
// Connect to MQTT broker
const client = mqtt_1.default.connect(mqttServer);
// Handle connection and publishing
client.on('connect', () => {
    console.log('Publisher: Connected to MQTT broker');
    // Publish random data every 5 seconds
    setInterval(() => {
        const temp = Math.random() * (35 - 15) + 15; // 15-35°C
        const humidity = Math.random() * (80 - 30) + 30; // 30-80%
        const payload = { temperature: temp, humidity: humidity };
        const payloadString = JSON.stringify(payload);
        client.publish(mqttTopic, payloadString, (err) => {
            if (!err) {
                console.log(`Publisher: Published to ${mqttTopic}: ${payloadString}`);
            }
            else {
                console.error('Publisher: Publish error:', err.message);
            }
        });
    }, 5000);
});
// Handle errors
client.on('error', (err) => {
    console.error('Publisher: MQTT error:', err.message);
});
