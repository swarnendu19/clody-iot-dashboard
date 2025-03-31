"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriber = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
// Configuration
const mqttServer = 'mqtt://test.mosquitto.org';
const mqttTopic = 'sensor/data/my_test_123'; // Match publisher topic
// Subscriber class
class Subscriber {
    constructor() {
        this.callback = null;
        this.client = mqtt_1.default.connect(mqttServer);
        this.client.on('connect', () => {
            console.log('Subscriber: Connected to MQTT broker');
            this.client.subscribe(mqttTopic, (err) => {
                if (!err) {
                    console.log(`Subscriber: Subscribed to topic: ${mqttTopic}`);
                }
                else {
                    console.error('Subscriber: Subscription error:', err.message);
                }
            });
        });
        this.client.on('message', (topic, message) => {
            const payload = message.toString();
            try {
                const data = JSON.parse(payload);
                if (this.callback) {
                    this.callback(data); // Call the registered callback with parsed data
                }
            }
            catch (e) {
                const error = e instanceof Error ? e : new Error('Unknown error');
                console.error('Subscriber: Error parsing JSON:', error.message);
            }
        });
        this.client.on('error', (err) => {
            console.error('Subscriber: MQTT error:', err.message);
        });
    }
    // Method to register a callback for received data
    onData(callback) {
        this.callback = callback;
    }
}
// Export a singleton instance
exports.subscriber = new Subscriber();
