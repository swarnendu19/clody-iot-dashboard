import Redis from 'ioredis';
import 'dotenv/config';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export default redis;