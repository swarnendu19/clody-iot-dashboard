import mqtt, { MqttClient } from 'mqtt';


const mqttServer: string = 'mqtt://test.mosquitto.org';
const mqttTopic: string = 'sensor/data/my_test_123';


interface SensorData {
    temperature: number;
    humidity: number;
}

const client: MqttClient = mqtt.connect(mqttServer);

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


client.on('error', (err: Error) => {
    console.error('MQTT error:', err.message);
});





