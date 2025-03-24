const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL setup
const pool = new Pool();
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS channels (
      id SERIAL PRIMARY KEY,
      api_key TEXT UNIQUE NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS sensor_data (
      id SERIAL PRIMARY KEY,
      channel_id INTEGER REFERENCES channels(id),
      fields JSONB,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );
  `);
})();

// Redis setup
const redisClient = redis.createClient({ url: 'redis://redis:6379' });
redisClient.connect();

// MQTT setup
const mqttClient = mqtt.connect('mqtt://mosquitto');

mqttClient.on('connect', () => {
  mqttClient.subscribe('channels/+/update');
});

mqttClient.on('message', async (topic, message) => {
  try {
    const { apiKey, ...fields } = JSON.parse(message.toString());
    const channel = await pool.query('SELECT id FROM channels WHERE api_key = $1', [apiKey]);
    if (channel.rows.length) {
      await pool.query(
        'INSERT INTO sensor_data (channel_id, fields) VALUES ($1, $2)',
        [channel.rows[0].id, fields]
      );
      const data = { channel_id: channel.rows[0].id, fields };
      mqttClient.publish(`channels/${channel.rows[0].id}/data`, JSON.stringify(data));
    }
  } catch (err) {
    console.error('MQTT Error:', err);
  }
});

// HTTP API
app.post('/update', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).send('Unauthorized');
  
  try {
    const channel = await pool.query('SELECT id FROM channels WHERE api_key = $1', [apiKey]);
    if (!channel.rows.length) return res.status(401).send('Invalid API key');
    
    await pool.query(
      'INSERT INTO sensor_data (channel_id, fields) VALUES ($1, $2)',
      [channel.rows[0].id, req.body]
    );
    
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/data', async (req, res) => {
  try {
    const cached = await redisClient.get(`data:${req.query.channel}`);
    if (cached) return res.json(JSON.parse(cached));
    
    const data = await pool.query(
      'SELECT fields, timestamp FROM sensor_data WHERE channel_id = $1 ORDER BY timestamp DESC LIMIT 100',
      [req.query.channel]
    );
    
    await redisClient.setEx(`data:${req.query.channel}`, 60, JSON.stringify(data.rows));
    res.json(data.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));