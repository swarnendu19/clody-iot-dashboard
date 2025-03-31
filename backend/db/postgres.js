import { Client } from 'pg';

const pgClient = new Client({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'sensor_data',
  password: process.env.PG_PASSWORD || 'password',
  port: process.env.PG_PORT || 5432,
});

// Initialize connection
(async () => {
  try {
    await pgClient.connect();
    console.log('Connected to PostgreSQL');
    
    // Create table if not exists
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS sensor_metadata (
        id SERIAL PRIMARY KEY,
        temp FLOAT NOT NULL,
        humidity FLOAT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        device_id VARCHAR(50) DEFAULT 'NodeMCU'
      );
    `);
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  }
})();

export async function storeMetadata(data) {
  try {
    await pgClient.query(
      'INSERT INTO sensor_metadata(temp, humidity, timestamp) VALUES($1, $2, $3)',
      [data.temp, data.humidity, data.timestamp]
    );
  } catch (err) {
    console.error('Error storing metadata:', err);
    throw err;
  }
}

export async function getLatestReadings(limit = 10) {
  try {
    const res = await pgClient.query(
      'SELECT * FROM sensor_metadata ORDER BY timestamp DESC LIMIT $1',
      [limit]
    );
    return res.rows;
  } catch (err) {
    console.error('Error fetching readings:', err);
    throw err;
  }
}