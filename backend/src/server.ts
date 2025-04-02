import express from 'express';
import http from 'http';
import mqttClient from '../config/mqtt';
import { setupMqtt } from './handlers/mqttHandler';
import { setupSocket } from './handlers/socketHandler';
import { startBatchProcessing } from './handlers/dbWriter';
import logger from './utils/logger';
import 'dotenv/config';
import { writeApi } from '../config/db';

const app = express();
const server = http.createServer(app);

setupSocket(server);
setupMqtt(mqttClient);
startBatchProcessing();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await writeApi.close(); // Close InfluxDB write API
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});