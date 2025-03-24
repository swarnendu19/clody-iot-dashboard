import Redis from 'ioredis';

const redisSub = new Redis();
const redisPub = new Redis();

redisSub.subscribe('sensor_data', (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log(`Subscribed to ${count} channel(s)`);
  }
});

redisSub.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
  // For simplicity, pass data through; add processing logic later if needed
  redisPub.publish('processed_data', message);
});