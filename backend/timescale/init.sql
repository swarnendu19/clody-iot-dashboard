CREATE TABLE IF NOT EXISTS sensor_readings (
  time TIMESTAMPTZ NOT NULL,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  device_id VARCHAR(50) DEFAULT 'NodeMCU'
);

CREATE EXTENSION IF NOT EXISTS timescaledb;
SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);