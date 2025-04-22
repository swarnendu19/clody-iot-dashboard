import React, { useState, useEffect } from "react";
import socket from "../socket";

const Dashboard = () => {
  const [data, setData] = useState({ moisture: 0, soil_temperature: 0 });

  useEffect(() => {
    const handleSensorUpdate = (newData) => {
      console.log("Received sensorUpdate:", newData);
      setData((prevData) => ({
        ...prevData,
        moisture: newData.moisture ?? 0,
        soil_temperature: newData.soil_temperature ?? 0,
      }));
    };

    socket.on("sensorUpdate", handleSensorUpdate);

    return () => {
      socket.off("sensorUpdate", handleSensorUpdate);
    };
  }, []);

  useEffect(() => {
    console.log("State updated:", data);
  }, [data]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Real-Time Soil Sensor Dashboard</h1>
      <p>Soil Moisture: {data.moisture.toFixed(2)} %</p>
      <p>Soil Temperature: {data.soil_temperature.toFixed(2)} °C</p>
    </div>
  );
};

export default Dashboard;
