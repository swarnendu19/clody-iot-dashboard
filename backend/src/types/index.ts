export interface SensorData {
    temp: number;
    humid: number;
    timestamp: number;
  }
  
  export interface AveragedData {
    startTime: Date;
    endTime: Date;
    date: string;
    avgTemp: number;
    avgHumid: number;
  }