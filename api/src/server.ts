import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { addSensorData } from './models/sensorData';
import { startWebSocketServer } from './utils/websocket';

dotenv.config();

const app = express();
app.use(express.json());

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

app.post('/api/data', async (req, res) => {
  const { deviceId, temperature, humidity } = req.body;

  if (!deviceId || typeof temperature !== 'number' || typeof humidity !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const data = await addSensorData(deviceId, temperature, humidity);
    await redis.publish('sensor_data', JSON.stringify({ deviceId, temperature, humidity }));
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  startWebSocketServer(); // Start WebSocket server
});