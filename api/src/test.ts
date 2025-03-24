import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
});

ws.on('message', (data: string) => {
  const sensorData = JSON.parse(data);
  console.log('Received real-time data:');
  console.log(`Device ID: ${sensorData.deviceId}`);
  console.log(`Temperature: ${sensorData.temperature}°C`);
  console.log(`Humidity: ${sensorData.humidity}%`);
  console.log('------------------------');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});