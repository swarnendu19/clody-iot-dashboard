import mqtt, { MqttClient } from 'mqtt';

// Configuration
const mqttServer: string = 'mqtt://test.mosquitto.org';
const mqttTopic: string = 'sensor/data/my_test_123'; // Use a unique key

// Define the data structure
interface SensorData {
    temperature: number;
    humidity: number;
}

// Connect to MQTT broker
const client: MqttClient = mqtt.connect(mqttServer);

// Handle connection and publishing
client.on('connect', () => {
    console.log('Publisher: Connected to MQTT broker');

    // Publish random data every 5 seconds
    setInterval(() => {
        const temp: number = Math.random() * (35 - 15) + 15; // 15-35°C
        const humidity: number = Math.random() * (80 - 30) + 30; // 30-80%
        const payload: SensorData = { temperature: temp, humidity: humidity };
        const payloadString: string = JSON.stringify(payload);

        client.publish(mqttTopic, payloadString, (err: any) => {
            if (!err) {
                console.log(`Publisher: Published to ${mqttTopic}: ${payloadString}`);
            } else {
                console.error('Publisher: Publish error:', err.message);
            }
        });
    }, 4000);
});

// Handle errors
client.on('error', (err: Error) => {
    console.error('Publisher: MQTT error:', err.message);
});

