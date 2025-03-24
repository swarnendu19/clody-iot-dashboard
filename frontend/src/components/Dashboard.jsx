import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorData(data);
    };
    return () => ws.close();
  }, []);

  return (
    <div>
      <h1>Real-Time Sensor Dashboard</h1>
      <p>Temperature: {sensorData.temperature}°C</p>
      <p>Humidity: {sensorData.humidity}%</p>
    </div>
  );
};

export default Dashboard;
