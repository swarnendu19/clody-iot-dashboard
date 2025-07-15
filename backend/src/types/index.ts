export interface SensorData {
  moisture: number;           // Moisture percentage (0–100)
  soil_temperature: number;   // Temperature in °C (e.g., 15–35)
  ph: number;                 // pH value (e.g., 4.5–8.0)
  salinity: number;           // Salinity in dS/m
  conductivity: number;       // EC in µS/cm
  timestamp: number;          // Unix timestamp
}
  
  export interface AveragedData {
    startTime: Date;
    endTime: Date;
    date: string;
    avgTemp: number;
    avgHumid: number;
    avgSalinity: number;
    avgConductivity: number;
  }
