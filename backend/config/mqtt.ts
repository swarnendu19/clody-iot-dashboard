import mqtt, { MqttClient } from 'mqtt';
import 'dotenv/config';
import logger from '../src/utils/logger'; // Assuming you have a logger utility

// Configuration with defaults
const mqttHost: string = process.env.MQTT_HOST || 'mqtt://broker.hivemq.com';
const mqttOptions: mqtt.IClientOptions = {
  clientId: `backend_${Math.random().toString(16).substr(2, 8)}`, // Unique client ID
  reconnectPeriod: 1000, // Reconnect after 1 second if disconnected
  connectTimeout: 30 * 1000, // 30 seconds timeout
  // Uncomment and configure if your broker requires credentials
  // username: process.env.MQTT_USER,
  // password: process.env.MQTT_PASS,
};

// Connect to MQTT broker
const client: MqttClient = mqtt.connect(mqttHost, mqttOptions);

// Event handlers
client.on('connect', () => {
  logger.info(`MQTT client connected to ${mqttHost}`);
});

client.on('reconnect', () => {
  logger.info('MQTT client reconnecting...');
});

client.on('offline', () => {
  logger.warn('MQTT client offline');
});

client.on('error', (error: Error) => {
  logger.error('MQTT client error:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received, disconnecting MQTT client...');
  client.end(() => {
    logger.info('MQTT client disconnected');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, disconnecting MQTT client...');
  client.end(() => {
    logger.info('MQTT client disconnected');
    process.exit(0);
  });
});

export default client;