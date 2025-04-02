import redis from '../../config/redis';
import { emit } from './socketHandler';
import logger from '../utils/logger';
import { SensorData } from '../types';
import { REDIS_KEY } from '../constants';
import mqtt from 'mqtt/*';


const MQTT_TOPIC = "dip/sensor"
export function setupMqtt(client: mqtt.MqttClient): void {
  client.on('connect', () => {
    logger.info('Connected to MQTT broker');
    client.subscribe(MQTT_TOPIC, (err: any) => {
      if (err) logger.error('MQTT subscription error:', err);
    });
  });

  client.on('message', async (topic: string, message: Buffer) => {
    try {
      const data: SensorData = JSON.parse(message.toString());
      logger.info('Received MQTT data:', data);

      // Forward to frontend
      emit('sensorUpdate', data);

      // Buffer in Redis
      await redis.rpush(REDIS_KEY, JSON.stringify(data));
    } catch (error) {
      logger.error('Error processing MQTT message:', error);
    }
  });

  client.on('error', (error) => {
    logger.error('MQTT client error:', error);
  });
}