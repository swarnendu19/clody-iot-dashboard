import { Pool } from 'pg';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import 'dotenv/config';

const pgPool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL as string,
  token: process.env.INFLUX_TOKEN as string,
});

const writeApi = influxDB.getWriteApi(
  process.env.INFLUX_ORG as string,
  process.env.INFLUX_BUCKET as string
);

export { pgPool, writeApi, Point };