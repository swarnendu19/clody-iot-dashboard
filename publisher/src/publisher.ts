import mqtt from 'mqtt';
import type { MqttClient } from 'mqtt';
import 'dotenv/config';
import logger from './utils/logger';
import { SensorData } from './types';

// Configuration
const mqttHost: string = process.env.MQTT_HOST || 'mqtt://broker.hivemq.com';
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
  const soil_temperature: number = parseFloat((Math.random() * (35 - 15) + 15).toFixed(2)); // 15–35°C
  const moisture: number = parseFloat((Math.random() * (100 - 20) + 20).toFixed(2)); // 20–100%
  const ph: number = parseFloat((Math.random() * (8.0 - 4.5) + 4.5).toFixed(2)); // 4.5–8.0 pH range
  const timestamp: number = Date.now();

  return { moisture, soil_temperature, ph, timestamp };
}

// Handle connection
client.on('connect', () => {
  logger.info('Publisher: Connected to MQTT broker');

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