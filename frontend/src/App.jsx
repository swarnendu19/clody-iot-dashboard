import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "wss://broker.hivemq.com:8000/mqtt"; // WebSocket MQTT URL
const MQTT_TOPIC = "dip/data";

const App = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(MQTT_TOPIC);
    });

    client.on("message", (topic, message) => {
      if (topic === MQTT_TOPIC) {
        const data = JSON.parse(message.toString());
        setSensorData(data);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Sensor Data Dashboard</h1>
      {sensorData ? (
        <div className="mt-5 p-6 bg-white rounded-lg shadow-md">
          <p className="text-xl">🌡️ Temperature: {sensorData.temperature}°C</p>
          <p className="text-xl">💧 Humidity: {sensorData.humidity}%</p>
        </div>
      ) : (
        <p className="mt-5 text-gray-500">Waiting for sensor data...</p>
      )}
    </div>
  );
};

export default App;
