const express = require('express');
const mqttClient = require('./services/mqtt');
const redis = require('./services/redis');
const wss = require('./services/websocket');
const { pgPool, timescalePool } = require('./config/db');

const app = express();
app.use(express.json());

// Initialize databases
async function initDB() {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS devices (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await timescalePool.query(`
    CREATE TABLE IF NOT EXISTS sensor_data (
      time TIMESTAMPTZ NOT NULL,
      device_id INT,
      temperature DOUBLE PRECISION,
      humidity DOUBLE PRECISION
    );
    SELECT create_hypertable('sensor_data', 'time', if_not_exists => true);
  `);
}

initDB().catch(console.error);

// Handle MQTT messages
mqttClient.on('message', async (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log('Received MQTT data:', data);

  // Store in TimescaleDB
  await timescalePool.query(
    'INSERT INTO sensor_data (time, device_id, temperature, humidity) VALUES (NOW(), $1, $2, $3)',
    [1, data.temperature, data.humidity] // Assuming device_id = 1
  );

  // Publish to Redis
  await redis.publish('sensor_data', JSON.stringify(data));

  // Broadcast to WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));