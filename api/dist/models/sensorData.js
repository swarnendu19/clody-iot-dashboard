"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSensorData = void 0;
const db_1 = require("../db");
const addSensorData = async (device_id, temperature, humidity) => {
    const res = await db_1.pool.query('INSERT INTO sensor_data (device_id, temperature, humidity, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *', [device_id, temperature, humidity]);
    return res.rows[0];
};
exports.addSensorData = addSensorData;
