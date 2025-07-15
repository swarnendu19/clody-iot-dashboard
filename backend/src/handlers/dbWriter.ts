import { pgPool, writeApi, Point } from '../../config/db';
import redis from '../../config/redis';
import logger from '../utils/logger';
import { SensorData, AveragedData } from '../types';
import { REDIS_KEY, BATCH_INTERVAL } from '../constants';

async function processBatch(): Promise<void> {
  try {
    const rawData = await redis.lrange(REDIS_KEY, 0, -1);
    if (!rawData.length) return;

    const data: SensorData[] = rawData.map((item) => JSON.parse(item));
    const averagedData = calculateAverages(data);

    // Write to PostgreSQL
    await pgPool.query(
      `INSERT INTO sensor_averages (start_time, end_time, date, avg_temp, avg_humid, avg_salinity, avg_conductivity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        averagedData.startTime,
        averagedData.endTime,
        averagedData.date,
        averagedData.avgTemp,
        averagedData.avgHumid,
        averagedData.avgSalinity,
        averagedData.avgConductivity,
      ]
    );

    // Write to InfluxDB
    const point = new Point('sensor_averages')
      .tag('date', averagedData.date)
      .floatField('avg_temp', averagedData.avgTemp)
      .floatField('avg_humid', averagedData.avgHumid)
      .floatField('avg_salinity', averagedData.avgSalinity)
      .floatField('avg_conductivity', averagedData.avgConductivity)
      .timestamp(averagedData.startTime);

    writeApi.writePoint(point);
    await writeApi.flush(); // Ensure data is written

    // Clear Redis buffer
    await redis.del(REDIS_KEY);
    logger.info(
      `Batch processed: ${data.length} records, Temp: ${averagedData.avgTemp}, Humid: ${averagedData.avgHumid}, Salinity: ${averagedData.avgSalinity}, Conductivity: ${averagedData.avgConductivity}`
    );
  } catch (error) {
    logger.error('Error processing batch:', error);
  }
}

function calculateAverages(data: SensorData[]): AveragedData {
  const tempSum = data.reduce((sum, d) => sum + d.soil_temperature, 0);
  const humidSum = data.reduce((sum, d) => sum + d.moisture, 0);
  const salinitySum = data.reduce((sum, d) => sum + d.salinity, 0);
  const conductivitySum = data.reduce((sum, d) => sum + d.conductivity, 0);
  const timestamps = data.map((d) => d.timestamp);
  const startTime = new Date(Math.min(...timestamps));
  const endTime = new Date(Math.max(...timestamps));
  const date = startTime.toISOString().split('T')[0];

  return {
    startTime,
    endTime,
    date,
    avgTemp: tempSum / data.length,
    avgHumid: humidSum / data.length,
    avgSalinity: salinitySum / data.length,
    avgConductivity: conductivitySum / data.length,
  };
}

export function startBatchProcessing(): void {
  setInterval(processBatch, BATCH_INTERVAL);
}
