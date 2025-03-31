import mqtt, { MqttClient } from 'mqtt';

// Configuration
const mqttServer: string = 'mqtt://test.mosquitto.org'; // Replace with your MQTT broker IP
const mqttTopic: string = 'sensor/data/my_test_123'; // Match the Arduino topic

// Define the expected data structure
interface SensorData {
    temperature: number;
    humidity: number;
}

// Connect to MQTT broker
const client: MqttClient = mqtt.connect(mqttServer);

// Handle connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(mqttTopic, (err: Error | null) => {
        if (!err) {
            console.log(`Subscribed to topic: ${mqttTopic}`);
        } else {
            console.error('Subscription error:', err.message);
        }
    });
});

// Handle incoming messages
client.on('message', (topic: string, message: Buffer) => {
    const payload: string = message.toString();
    console.log(`Received data on ${topic}: ${payload}`);

    try {
        const data: SensorData = JSON.parse(payload);
        console.log(`Temperature: ${data.temperature}°C, Humidity: ${data.humidity}%`);
    } catch (e: unknown) {
        const error = e instanceof Error ? e : new Error('Unknown error');
        console.error('Error parsing JSON:', error.message);
    }
});

// Handle errors
client.on('error', (err: Error) => {
    console.error('MQTT error:', err.message);
});