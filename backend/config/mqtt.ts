import mqtt, { MqttClient } from 'mqtt';
import 'dotenv/config';
import logger from '../src/utils/logger';

// Configuration
const mqttHost: string ='mqtt://broker.hivemq.com';
// const mqttHost: string = process.env.MQTT_HOST || 'mqtt://192.168.0.100'; // Uncomment for local Mosquitto

// Validate MQTT host
if (!mqttHost.startsWith('mqtt://') && !mqttHost.startsWith('mqtts://') && !mqttHost.startsWith('ws://')) {
  logger.error(`Invalid MQTT_HOST: ${mqttHost}. Must include protocol (e.g., mqtt://, mqtts://, ws://)`);
  process.exit(1);
}

const mqttOptions: mqtt.IClientOptions = {
  clientId: `backend_${Math.random().toString(16).substr(2, 8)}`,
  reconnectPeriod: 2000, // Reconnect every 2 seconds
  connectTimeout: 60 * 1000, // Increased to 60 seconds
  keepalive: 60, // Keep-alive 60 seconds
};

// Connect to MQTT broker
const client: MqttClient = mqtt.connect(mqttHost, mqttOptions);

// Event handlers
client.on('connect', () => {
  logger.info(`MQTT client connected to ${mqttHost}`);
});

client.on('reconnect', () => {
  logger.info(`MQTT client reconnecting to ${mqttHost}...`);
});

client.on('offline', () => {
  logger.warn(`MQTT client offline for ${mqttHost}`);
});

client.on('error', (error: Error) => {
  logger.error(`MQTT client error for ${mqttHost}: ${error.message}`, error.stack);
});

client.on('close', () => {
  logger.info(`MQTT client disconnected from ${mqttHost}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received, disconnecting MQTT client...');
  client.end(true, () => {
    logger.info('MQTT client disconnected');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, disconnecting MQTT client...');
  client.end(true, () => {
    logger.info('MQTT client disconnected');
    process.exit(0);
  });
});

export default client;