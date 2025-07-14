export interface SensorData {
  moisture: number;           // Moisture percentage (0–100)
  soil_temperature: number;   // Temperature in °C (e.g., 15–35)
  ph: number;                 // pH value (e.g., 4.5–8.0)
  timestamp: number;          // Unix timestamp
}