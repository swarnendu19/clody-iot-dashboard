import React, { useState, useEffect } from "react";
import socket from "../socket";

const Dashboard = () => {
  const [data, setData] = useState({ temperature: 0, humidity: 0 });

  useEffect(() => {
    const handleSensorUpdate = (newData) => {
      console.log("Received sensorUpdate:", newData);
      setData({
        temperature: newData.temperature ?? 0,
        humidity: newData.humidity ?? 0,
      });
    };

    socket.on("sensorUpdate", handleSensorUpdate);

    return () => {
      socket.off("sensorUpdate", handleSensorUpdate);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div style={{ padding: "20px" }}>
      <h1>Real-Time Sensor Dashboard</h1>
      <p>Temperature: {data.temperature.toFixed(2)} °C</p>
      <p>Humidity: {data.humidity.toFixed(2)} %</p>
    </div>
  );
};

export default Dashboard;
