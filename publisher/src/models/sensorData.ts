import { pool } from '../db';

export interface SensorData {
  id: number;
  device_id: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
}

export const addSensorData = async (
  device_id: number,
  temperature: number,
  humidity: number
): Promise<SensorData> => {
  const res = await pool.query(
    'INSERT INTO sensor_data (device_id, temperature, humidity, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [device_id, temperature, humidity]
  );
  return res.rows[0];
};