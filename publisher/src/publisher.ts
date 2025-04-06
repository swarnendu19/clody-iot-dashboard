import mqtt, { MqttClient } from 'mqtt';
import 'dotenv/config';
import logger from './utils/logger';
import { SensorData } from './types';

// Configuration
const mqttHost: string = process.env.MQTT_HOST || 'mqtt://localhost:1883';
const mqttTopic: string = process.env.MQTT_TOPIC || 'dip/sensor';
const mqttUser: string | undefined = process.env.MQTT_USER;
const mqttPass: string | undefined = process.env.MQTT_PASS;
const publishInterval: number = parseInt(process.env.PUBLISH_INTERVAL || '5000', 10);

// MQTT client options
const mqttOptions: mqtt.IClientOptions = {
  username: mqttUser,
  password: mqttPass,
  clientId: `mqtt_publisher_${Math.random().toString(16).substr(2, 8)}`, // Unique client ID
  reconnectPeriod: 1000, // Reconnect after 1 second if disconnected
  connectTimeout: 30 * 1000, // 30 seconds timeout
};

// Connect to MQTT broker
const client: MqttClient = mqtt.connect(mqttHost, mqttOptions);

// Generate random sensor data
function generateSensorData(): SensorData {
  const temperature: number = parseFloat((Math.random() * (35 - 15) + 15).toFixed(2)); // 15-35°C
  const humidity: number = parseFloat((Math.random() * (80 - 30) + 30).toFixed(2)); // 30-80%
  const timestamp: number = Date.now();
  return { temperature, humidity, timestamp };
}

// Handle connection
client.on('connect', () => {
  logger.info('Publisher: Connected to MQTT broker');

  // Publish data at regular intervals
  setInterval(() => {
    const payload: SensorData = generateSensorData();
    const payloadString: string = JSON.stringify(payload);

    client.publish(mqttTopic, payloadString, { qos: 1 }, (err: Error | undefined) => {
      if (!err) {
        logger.info(`Publisher: Published to ${mqttTopic}: ${payloadString}`);
      } else {
        logger.error('Publisher: Publish error:', err.message);
      }
    });
  }, publishInterval);
});

// Handle reconnection
client.on('reconnect', () => {
  logger.info('Publisher: Reconnecting to MQTT broker...');
});

// Handle offline state
client.on('offline', () => {
  logger.warn('Publisher: MQTT client offline');
});

// Handle errors
client.on('error', (err: Error) => {
  logger.error('Publisher: MQTT error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Publisher: SIGINT received, shutting down...');
  client.end(() => {
    logger.info('Publisher: MQTT client disconnected');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('Publisher: SIGTERM received, shutting down...');
  client.end(() => {
    logger.info('Publisher: MQTT client disconnected');
    process.exit(0);
  });
});