import mqtt from 'mqtt';
import { createClient } from 'redis';

const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://broker.hivemq.com';
const mqttClient = mqtt.connect(MQTT_BROKER);
const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

await redisClient.connect();

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('sensor/data', (err) => {
    if (err) console.error('MQTT subscribe error:', err);
  });
});

mqttClient.on('message', (topic, message) => {
  try {
    if (topic === 'sensor/data') {
      const data = {
        ...JSON.parse(message.toString()),
        timestamp: new Date().toISOString()
      };
      redisClient.publish('sensor_queue', JSON.stringify(data));
    }
  } catch (err) {
    console.error('Error processing MQTT message:', err);
  }
});

mqttClient.on('error', (err) => {
  console.error('MQTT error:', err);
});

process.on('SIGINT', () => {
  mqttClient.end();
  redisClient.quit();
});