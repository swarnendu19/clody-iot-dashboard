import { Client } from 'pg';

const tsClient = new Client({
  user: process.env.TS_USER || 'timescale',
  host: process.env.TS_HOST || 'localhost',
  database: process.env.TS_DATABASE || 'timeseries',
  password: process.env.TS_PASSWORD || 'password',
  port: process.env.TS_PORT || 5433,
});

// Initialize connection
(async () => {
  try {
    await tsClient.connect();
    console.log('Connected to TimescaleDB');
    
    // Create hypertable if not exists
    await tsClient.query(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        time TIMESTAMPTZ NOT NULL,
        temperature FLOAT NOT NULL,
        humidity FLOAT NOT NULL,
        device_id VARCHAR(50) DEFAULT 'NodeMCU'
      );
    `);
    
    await tsClient.query(`
      SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);
    `);
  } catch (err) {
    console.error('TimescaleDB connection error:', err);
    process.exit(1);
  }
})();

export async function storeTimeSeries(data) {
  try {
    await tsClient.query(
      `INSERT INTO sensor_readings(time, temperature, humidity)
       VALUES($1, $2, $3)`,
      [data.timestamp, data.temp, data.humidity]
    );
  } catch (err) {
    console.error('Error storing time series:', err);
    throw err;
  }
}

export async function getTimeSeriesData(hours = 24) {
  try {
    const result = await tsClient.query(
      `SELECT time, temperature, humidity 
       FROM sensor_readings 
       WHERE time > NOW() - INTERVAL '${hours} hours' 
       ORDER BY time ASC`
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching time series:', err);
    throw err;
  }
}