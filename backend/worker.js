import { createClient } from 'redis';
import { storeTimeSeries } from './db/timescale.js';
import { storeMetadata } from './db/postgres.js';

const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

await redisClient.connect();

// Process messages from Redis queue
const processSensorData = async (message) => {
  try {
    const data = JSON.parse(message);
    console.log('Processing sensor data:', data);
    
    // Store in both databases in parallel
    await Promise.all([
      storeMetadata(data),
      storeTimeSeries(data)
    ]);
    
  } catch (err) {
    console.error('Error processing sensor data:', err);
  }
};

// Subscribe to Redis channel
await redisClient.subscribe('sensor_queue', (message) => {
  processSensorData(message).catch(console.error);
});

console.log('Worker started and subscribed to sensor_queue');