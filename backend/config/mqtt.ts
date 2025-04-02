import mqtt from 'mqtt';
import 'dotenv/config';

const client = mqtt.connect(process.env.MQTT_HOST as string, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
});

export default client;