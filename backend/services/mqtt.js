const mqtt = require('mqtt');
require('dotenv').config();

const client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}:${process.env.MQTT_PORT}`);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (!err) console.log(`Subscribed to ${process.env.MQTT_TOPIC}`);
  });
});

module.exports = client;