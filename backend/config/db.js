const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL for metadata
const pgPool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// TimescaleDB for time-series data
const timescalePool = new Pool({
  host: process.env.TIMESCALE_HOST,
  user: process.env.TIMESCALE_USER,
  password: process.env.TIMESCALE_PASSWORD,
  database: process.env.TIMESCALE_DATABASE,
});

module.exports = { pgPool, timescalePool };