import mqtt, { MqttClient } from 'mqtt';

// Configuration
const mqttServer: string = 'mqtt://test.mosquitto.org';
const mqttTopic: string = 'sensor/data/my_test_123'; // Match publisher topic

// Define the data structure
interface SensorData {
    temperature: number;
    humidity: number;
}

// Callback type for handling received data
type DataCallback = (data: SensorData) => void;

// Subscriber class
class Subscriber {
    private client: MqttClient;
    private callback: DataCallback | null = null;

    constructor() {
        this.client = mqtt.connect(mqttServer);

        this.client.on('connect', () => {
            console.log('Subscriber: Connected to MQTT broker');
            this.client.subscribe(mqttTopic, (err: Error | null) => {
                if (!err) {
                    console.log(`Subscriber: Subscribed to topic: ${mqttTopic}`);
                } else {
                    console.error('Subscriber: Subscription error:', err.message);
                }
            });
        });

        this.client.on('message', (topic: string, message: Buffer) => {
            const payload: string = message.toString();
            try {
                const data: SensorData = JSON.parse(payload);
                if (this.callback) {
                    this.callback(data); // Call the registered callback with parsed data
                }
            } catch (e: unknown) {
                const error = e instanceof Error ? e : new Error('Unknown error');
                console.error('Subscriber: Error parsing JSON:', error.message);
            }
        });

        this.client.on('error', (err: Error) => {
            console.error('Subscriber: MQTT error:', err.message);
        });
    }

    // Method to register a callback for received data
    public onData(callback: DataCallback): void {
        this.callback = callback;
    }
}

// Export a singleton instance
export const subscriber = new Subscriber();